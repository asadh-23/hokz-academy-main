import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserWishlist,
    selectUserWishlist,
    selectUserWishlistLoading,
    toggleUserWishlist,
    clearUserWishlist,
    selectUserClearWishlistLoading,
    selectUserWishlistLoadingById,
} from "../../store/features/user/userWishlistSlice";
import {
    addToUserCart,
    selectUserAddCartLoadingById,
    selectUserCart,
    fetchUserCart,
} from "../../store/features/user/userCartSlice";
import WishlistHeader from "../../components/user/wishlist/WishlistHeader";
import WishlistSearchBar from "../../components/user/wishlist/WishlistSearchBar";
import WishlistCard from "../../components/user/wishlist/WishlistCard";
import WishlistEmptyState from "../../components/user/wishlist/WishlistEmptyState";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";

const WishList = () => {
    const dispatch = useDispatch();
    // Redux selectors
    const wishlist = useSelector(selectUserWishlist);
    const loading = useSelector(selectUserWishlistLoading);
    const clearWishlistLoading = useSelector(selectUserClearWishlistLoading);
    const removeWishlitLoadingById = useSelector(selectUserWishlistLoadingById);
    const addToCartLoadingById = useSelector(selectUserAddCartLoadingById);
    const cart = useSelector(selectUserCart);

    const navigate = useNavigate();

    const handleContinueLearning = (courseId) => {
        navigate(`/user/learn/${courseId}`); // Course Details page-ilekko allengil Player-ilekko vidam
    };
    // Local state
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Filter states
    const [filters, setFilters] = useState({
        sort: "",
        minPrice: "",
        maxPrice: "",
    });

    const [tempFilters, setTempFilters] = useState({
        sort: "",
        minPrice: "",
        maxPrice: "",
    });

    const sortOptions = [
        { value: "", label: "Default" },
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "low-high", label: "Price: Low to High" },
        { value: "high-low", label: "Price: High to Low" },
    ];

    // Fetch wishlist on mount
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                await dispatch(fetchUserWishlist()).unwrap();
            } catch (error) {
                toast.error(error || "Failed to load wishlist");
            }
        };
        loadWishlist();
        dispatch(fetchUserCart());
    }, [dispatch]);

    const cartCourseIds = useMemo(() => {
        if (!cart || !cart.items) return new Set();
        return new Set(cart.items.map((item) => item.course?._id));
    }, [cart]);

    const isInCart = (courseId) => {
        return cartCourseIds.has(courseId);
    };

    const filteredWishlist = useMemo(() => {
        let result = [...wishlist];

        // A. Search Filter
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (item) =>
                    item.course?.title?.toLowerCase().includes(query) ||
                    item.course?.tutor?.fullName?.toLowerCase().includes(query) ||
                    item.course?.category?.name?.toLowerCase().includes(query)
            );
        }

        // B. Price Filter
        if (filters.minPrice !== "" || filters.maxPrice !== "") {
            result = result.filter((item) => {
                const c = item.course;
                if (!c) return false;

                const finalPrice = c.price - (c.price * c.offerPercentage) / 100;
                const min = filters.minPrice === "" ? 0 : Number(filters.minPrice);
                const max = filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);

                return finalPrice >= min && finalPrice <= max;
            });
        }

        // C. Sorting
        if (filters.sort) {
            result.sort((a, b) => {
                const ca = a.course;
                const cb = b.course;
                if (!ca || !cb) return 0;

                const priceA = ca.price - (ca.price * ca.offerPercentage) / 100;
                const priceB = cb.price - (cb.price * cb.offerPercentage) / 100;

                switch (filters.sort) {
                    case "low-high":
                        return priceA - priceB;
                    case "high-low":
                        return priceB - priceA;
                    case "newest":
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case "oldest":
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    default:
                        return 0;
                }
            });
        }

        return result;
    }, [wishlist, searchQuery, filters]);

    // =========================================================
    // 2. PAGINATION LOGIC (Calculated on the fly) ✅
    // =========================================================

    // Reset page to 1 if filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    // Calculate current items for the specific page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredWishlist.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);

    // =========================================================
    // HANDLERS
    // =========================================================

    const handleRemoveFromWishlist = async (courseId, courseTitle) => {
        try {
            // Note: Make sure to pass courseId here as per your thunk logic
            await dispatch(toggleUserWishlist(courseId)).unwrap();
            toast.success(`${courseTitle} removed from wishlist`);
        } catch (error) {
            toast.error(error || "Failed to remove from wishlist");
        }
    };

    const handleClearAll = async () => {
        if (wishlist.length === 0) {
            toast.info("Your wishlist is already empty");
            return;
        }

        if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
            try {
                await dispatch(clearUserWishlist()).unwrap();
                toast.success("Wishlist cleared successfully");
            } catch (error) {
                toast.error("Failed to clear wishlist");
            }
        }
    };

    const handleAddToCart = async (courseId, courseTitle) => {
        try {
            await dispatch(addToUserCart(courseId)).unwrap();
            toast.success(`${courseTitle} added to cart`);
        } catch (error) {
            console.error("Add to cart error:", error);
            const errorMessage = typeof error === "string" ? error : error?.message || "Failed to add to cart";
            toast.error(errorMessage);
        }
    };

    const calculateTotalValue = () => {
        return wishlist.reduce((sum, item) => {
            const c = item.course;
            if (!c) return sum;
            const price = c.price - (c.price * c.offerPercentage) / 100;
            return sum + price;
        }, 0);
    };

    const handleTempFilterChange = (field, value) => {
        setTempFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        const defaultFilters = { sort: "", minPrice: "", maxPrice: "" };
        setFilters(defaultFilters);
        setTempFilters(defaultFilters);
        setIsFilterOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    // ... inside WishList component

    const handleRefresh = async () => {
        try {
            setSearchQuery("");
            setCurrentPage(1);

            const defaultFilters = { sort: "", minPrice: "", maxPrice: "" };
            setFilters(defaultFilters);
            setTempFilters(defaultFilters);

            setIsFilterOpen(false);

            await dispatch(fetchUserWishlist()).unwrap();
        } catch (error) {
            toast.error("Failed to refresh wishlist");
        }
    };

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sort;

       return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- BRANDED HERO & NAVIGATION --- */}
            <div className="bg-[#1E2EDE] relative overflow-hidden pb-20 pt-10 md:pt-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14C4E7] opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E6D929] opacity-10 rounded-full translate-y-10 -translate-x-10"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <WishlistHeader
                        itemCount={wishlist.length}
                        totalValue={calculateTotalValue()}
                        onRefresh={handleRefresh}
                        onClearAll={handleClearAll}
                        loading={loading}
                        clearLoading={clearWishlistLoading}
                    />
                </div>
            </div>

            {/* --- SEARCH & CONTENT SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-4 md:p-6 border border-slate-50 mb-10">
                    <WishlistSearchBar
                        searchQuery={searchQuery}
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                        onClearSearch={() => setSearchQuery("")}
                        isFilterOpen={isFilterOpen}
                        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
                        hasActiveFilters={hasActiveFilters}
                        tempFilters={tempFilters}
                        onTempFilterChange={handleTempFilterChange}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                        sortOptions={sortOptions}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-50">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1E2EDE]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#E6D929] rounded-lg rotate-45"></div>
                        </div>
                        <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Syncing Wishlist...</p>
                    </div>
                ) : filteredWishlist.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {currentItems.map((item) => (
                                <WishlistCard
                                    key={item._id}
                                    item={item}
                                    onRemove={handleRemoveFromWishlist}
                                    removeWishlitLoadingById={removeWishlitLoadingById}
                                    onAddToCart={handleAddToCart}
                                    addToCartLoadingById={addToCartLoadingById}
                                    isInCart={isInCart(item.course?._id)}
                                    onContinueLearning={handleContinueLearning}
                                />
                            ))}
                        </div>

                        <div className="mt-16">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredWishlist.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                                label="Courses"
                            />
                        </div>
                    </>
                ) : (
                    <WishlistEmptyState searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
                )}
            </div>
        </div>
    );
};

export default WishList;
