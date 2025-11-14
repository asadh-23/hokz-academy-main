import { useState, useEffect } from "react";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";
import AddCategoryModal from "../../components/admin/categories/AddCategoryModal";
import EditCategoryModal from "../../components/admin/categories/EditCategoryModal";
import CategoryList from "../../components/admin/Categories/CategoryList";
import CategoryStatsCards from "../../components/admin/categories/CategoryStatsCards";
import Pagination from "../../components/admin/Pagination";

const ManageCategory = () => {
    // -------------------- STATE --------------------
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Categories");

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 3;

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalFilteredItems: 0,
    });

    const [stats, setStats] = useState({
        total: 0,
        listed: 0,
        unlisted: 0,
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // -------------------- FETCH CATEGORIES --------------------
    const fetchCategories = async (showLoader = false) => {
        if (showLoader) setIsLoading(true);

        try {
            const response = await adminAxios.get("/categories", {
                params: {
                    page: currentPage,
                    limit: categoriesPerPage,
                    search: searchTerm,
                    status: filterStatus === "All Categories" ? "" : filterStatus,
                },
            });

            if (response.data?.success) {
                setCategories(response.data.categories);
                setPagination(response.data.pagination);
                setStats(response.data.stats);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load categories");
        } finally {
            if (showLoader) setIsLoading(false);
        }
    };

    // -------------------- EFFECTS --------------------
    useEffect(() => {
        fetchCategories(true); // initial load
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [currentPage, filterStatus, searchTerm]);

    // Reset page when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // -------------------- HANDLERS --------------------
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setFilterStatus(e.target.value);

    const handleRefresh = () => {
        setSearchTerm("");
        setFilterStatus("All Categories");
        setCurrentPage(1);
        fetchCategories(true);
    };

    // -------------------- MODAL HANDLERS --------------------
    const handleAddClick = () => setShowAddModal(true);

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleCloseAddModal = () => setShowAddModal(false);

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
    };

    const handleModalSuccess = () => {
        fetchCategories(true);
    };

    // -------------------- LIST / UNLIST --------------------
    const handleListCategory = async (categoryId) => {
        const category = categories.find((c) => c._id === categoryId);
        const categoryName = category?.name || "this category";

        try {
            const response = await adminAxios.patch(`/categories/${categoryId}/list`);

            if (response.data?.success) {
                toast.success(response.data?.message || `${categoryName} listed successfully`);
                fetchCategories();
            }
        } catch (error) {
            console.log("Failed to list category : ", error);
            toast.error(error.response?.data?.message || "Failed to list category");
        }
    };

    const handleUnlistCategory = async (categoryId) => {
        const category = categories.find((c) => c._id === categoryId);
        const categoryName = category?.name || "this category";

        toast.warning(`Are you sure you want to unlist ${categoryName}?`, {
            action: {
                label: "Unlist",
                onClick: async () => {
                    try {
                        const response = await adminAxios.patch(`/categories/${categoryId}/unlist`);

                        if (response.data?.success) {
                            toast.success(response.data?.message || `${categoryName} has been unlisted`);
                            fetchCategories();
                        }
                    } catch (error) {
                        console.log("Failed to unlist category : ", error);
                        toast.error(error.response?.data?.message || "Failed to unlist category");
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    // -------------------- RENDER --------------------
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex flex-1">
                    <div className="flex justify-center items-center flex-1">
                        <PageLoader text="Loading Categories..." />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Management</h1>
                        <p className="text-gray-600">Manage course categories</p>
                    </div>

                    {/* Stats Cards */}
                    <CategoryStatsCards stats={stats} />

                    {/* Controls Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-800">List of Categories</h2>

                                <select
                                    value={filterStatus}
                                    onChange={handleFilterChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Listed">Listed</option>
                                    <option value="Unlisted">Unlisted</option>
                                </select>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-64"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Refresh button */}
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                                >
                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    ADD CATEGORY
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories List */}
                    <CategoryList
                        categories={categories}
                        onEdit={handleEditClick}
                        onList={handleListCategory}
                        onUnlist={handleUnlistCategory}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalFilteredItems}
                        itemsPerPage={categoriesPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Modals */}
            <AddCategoryModal isOpen={showAddModal} onClose={handleCloseAddModal} onSuccess={handleModalSuccess} />

            <EditCategoryModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSuccess={handleModalSuccess}
                category={selectedCategory}
            />
        </div>
    );
};

export default ManageCategory;
