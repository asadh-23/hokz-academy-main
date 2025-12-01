// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//     fetchUserWishlist,
//     removeFromUserWishlist,
//     selectUserWishlist,
//     selectUserWishlistLoading,
// } from "../../store/features/user/userWishlistSlice";
// import WishlistHeader from "../../components/user/wishlist/WishlistHeader";
// import WishlistSearchBar from "../../components/user/wishlist/WishlistSearchBar";
// import WishlistCard from "../../components/user/wishlist/WishlistCard";
// import WishlistEmptyState from "../../components/user/wishlist/WishlistEmptyState";

// const WishList = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     // Redux selectors
//     const wishlist = useSelector(selectUserWishlist);
//     const loading = useSelector(selectUserWishlistLoading);

//     // Local state
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredWishlist, setFilteredWishlist] = useState([]);
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [filters, setFilters] = useState({
//         sort: "",
//         minPrice: "",
//         maxPrice: "",
//     });
//     const [tempFilters, setTempFilters] = useState({
//         sort: "",
//         minPrice: "",
//         maxPrice: "",
//     });

//     const sortOptions = [
//         { value: "", label: "Default" },
//         { value: "newest", label: "Newest First" },
//         { value: "oldest", label: "Oldest First" },
//         { value: "low-high", label: "Price: Low to High" },
//         { value: "high-low", label: "Price: High to Low" },
//     ];

//     // Fetch wishlist on mount
//     useEffect(() => {
//         loadWishlist();
//     }, []);

//     // Filter and sort wishlist
//     useEffect(() => {
//         let filtered = [...wishlist];

//         // Search filter
//         if (searchQuery.trim() !== "") {
//             filtered = filtered.filter(
//                 (item) =>
//                     item.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     item.course?.tutor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     item.course?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         // Price filter
//         if (filters.minPrice !== "" || filters.maxPrice !== "") {
//             filtered = filtered.filter((item) => {
//                 const course = item.course;
//                 if (!course) return false;
//                 const price = course.price - (course.price * course.offerPercentage) / 100;
//                 const min = filters.minPrice === "" ? 0 : Number(filters.minPrice);
//                 const max = filters.maxPrice === "" ? Infinity : Number(filters.maxPrice);
//                 return price >= min && price <= max;
//             });
//         }

//         // Sort
//         if (filters.sort) {
//             filtered.sort((a, b) => {
//                 const courseA = a.course;
//                 const courseB = b.course;
//                 if (!courseA || !courseB) return 0;

//                 const priceA = courseA.price - (courseA.price * courseA.offerPercentage) / 100;
//                 const priceB = courseB.price - (courseB.price * courseB.offerPercentage) / 100;

//                 switch (filters.sort) {
//                     case "low-high":
//                         return priceA - priceB;
//                     case "high-low":
//                         return priceB - priceA;
//                     case "newest":
//                         return new Date(b.createdAt) - new Date(a.createdAt);
//                     case "oldest":
//                         return new Date(a.createdAt) - new Date(b.createdAt);
//                     default:
//                         return 0;
//                 }
//             });
//         }

//         setFilteredWishlist(filtered);
//     }, [searchQuery, wishlist, filters]);

//     const loadWishlist = async () => {
//         try {
//             await dispatch(fetchUserWishlist()).unwrap();
//         } catch (error) {
//             toast.error(error || "Failed to load wishlist");
//         }
//     };

//     const handleRemoveFromWishlist = async (wishlistId, courseTitle) => {
//         try {
//             await dispatch(removeFromUserWishlist(wishlistId)).unwrap();
//             toast.success(`${courseTitle} removed from wishlist`);
//         } catch (error) {
//             toast.error(error || "Failed to remove from wishlist");
//         }
//     };

//     const handleClearAll = async () => {
//         if (wishlist.length === 0) {
//             toast.info("Your wishlist is already empty");
//             return;
//         }

//         if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
//             try {
//                 const removePromises = wishlist.map((item) =>
//                     dispatch(removeFromUserWishlist(item._id)).unwrap()
//                 );
//                 await Promise.all(removePromises);
//                 toast.success("Wishlist cleared successfully");
//             } catch (error) {
//                 toast.error("Failed to clear wishlist");
//             }
//         }
//     };

//     const handleAddToCart = (courseId, courseTitle) => {
//         // TODO: Implement add to cart functionality
//         toast.info(`Add to cart feature coming soon for: ${courseTitle}`);
//     };

//     const calculateTotalValue = () => {
//         return wishlist.reduce((total, item) => {
//             const course = item.course;
//             if (!course) return total;
//             const discountedPrice = course.price - (course.price * course.offerPercentage) / 100;
//             return total + discountedPrice;
//         }, 0);
//     };

//     const handleTempFilterChange = (field, value) => {
//         setTempFilters((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleApplyFilters = () => {
//         setFilters(tempFilters);
//         setIsFilterOpen(false);
//     };

//     const handleClearFilters = () => {
//         setFilters({ sort: "", minPrice: "", maxPrice: "" });
//         setTempFilters({ sort: "", minPrice: "", maxPrice: "" });
//         setIsFilterOpen(false);
//     };

//     const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sort;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             {/* Header Section */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                     <WishlistHeader
//                         itemCount={wishlist.length}
//                         totalValue={calculateTotalValue()}
//                         onRefresh={loadWishlist}
//                         onClearAll={handleClearAll}
//                         onViewCart={() => navigate("/user/cart")}
//                         loading={loading}
//                     />

//                     <WishlistSearchBar
//                         searchQuery={searchQuery}
//                         onSearchChange={(e) => setSearchQuery(e.target.value)}
//                         onClearSearch={() => setSearchQuery("")}
//                         isFilterOpen={isFilterOpen}
//                         onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
//                         hasActiveFilters={hasActiveFilters}
//                         tempFilters={tempFilters}
//                         onTempFilterChange={handleTempFilterChange}
//                         onApplyFilters={handleApplyFilters}
//                         onClearFilters={handleClearFilters}
//                         sortOptions={sortOptions}
//                     />
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Wishlist Grid */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-20">
//                         <div className="relative">
//                             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
//                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                                 <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"></div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : filteredWishlist.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredWishlist.map((item) => (
//                             <WishlistCard
//                                 key={item._id}
//                                 item={item}
//                                 onRemove={handleRemoveFromWishlist}
//                                 onAddToCart={handleAddToCart}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <WishlistEmptyState
//                         searchQuery={searchQuery}
//                         onClearSearch={() => setSearchQuery("")}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WishList;
