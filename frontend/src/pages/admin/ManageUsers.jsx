import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentStatsCards from "../../components/admin/students/StudentStatsCards";
import StudentTable from "../../components/admin/students/StudentTable";
import Pagination from "../../components/common/Pagination";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { toast } from "sonner";
import {
    fetchAdminUsers,
    toggleAdminUserBlock,
    setAdminUserFilters,
    selectAdminUsers,
    selectAdminUserPagination,
    selectAdminUserStats,
    selectAdminUserFilters,
    clearAdminUserFilters,
} from "../../store/features/admin/adminUserSlice";

const ManageUsers = () => {
    const dispatch = useDispatch();

    const [firstLoad, setFirstLoad] = useState(true);

    // Redux selectors
    const students = useSelector(selectAdminUsers);
    const pagination = useSelector(selectAdminUserPagination);
    const stats = useSelector(selectAdminUserStats);
    const filters = useSelector(selectAdminUserFilters);

    // -------------------- FETCH USERS --------------------
    const fetchStudents = async () => {
        try {
            await dispatch(
                fetchAdminUsers({
                    page: filters.page,
                    limit: filters.limit,
                    search: filters.search,
                    status: filters.status,
                })
            ).unwrap();
            setFirstLoad(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error(error.message || "Failed to load students");
        }
    };

    // -------------------- EFFECTS --------------------

    // ✅ Fetch when filters change
    useEffect(() => {
        fetchStudents();
    }, [filters.page, filters.status]);

    
    useEffect(() => {
        dispatch(setAdminUserFilters({ page: 1 }));
    }, [filters.search, filters.status]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchStudents();
        }, 500);
        return () => clearTimeout(delay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    // -------------------- HANDLERS --------------------
    const handleSearch = (e) => {
        dispatch(setAdminUserFilters({ search: e.target.value }));
    };

    const handleFilterChange = (e) => {
        dispatch(setAdminUserFilters({ status: e.target.value }));
    };

    const handlePageChange = (page) => {
        dispatch(setAdminUserFilters({ page }));
    };

    const handleRefresh = () => {
        dispatch(clearAdminUserFilters());
    };

    // -------------------- ACTION HANDLERS --------------------
    const handleToggleBlockStudent = async (userId, userName, status) => {
        const actionText = status === "Blocked" ? "Unblock" : "Block";

        toast.warning(`Are you sure you want to ${actionText} ${userName}?`, {
            action: {
                label: actionText,
                onClick: async () => {
                    try {
                        await dispatch(toggleAdminUserBlock({ userId })).unwrap();
                        fetchStudents();

                        toast.success(`${userName} has been ${actionText}ed successfully`);
                    } catch (error) {
                        console.error(`Failed to ${actionText} user:`, error);
                        toast.error(error.message || `Failed to ${actionText.toLowerCase()} user`);
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    // -------------------- RENDER --------------------
    if (firstLoad) {
        return (
            <div className="flex justify-center items-center flex-1 h-[80vh]">
                <PageLoader text="Loading Students..." />
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 p-6 md:p-8 overflow-y-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Students</h1>
                <p className="text-gray-600">Manage all registered students</p>
            </div>

            {/* ✅ Stats Section */}
            <StudentStatsCards stats={stats} />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Left: Title + Filter */}
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">Student List</h2>
                        <select
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="All">All Students</option>
                            <option value="Active">Active Students</option>
                            <option value="Blocked">Blocked Students</option>
                            <option value="Inactive">Inactive Students</option>
                        </select>
                    </div>

                    {/* Right: Search + Refresh */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={filters.search}
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
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <StudentTable students={students} onToggleBlock={handleToggleBlockStudent} />

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalFilteredUsers || 0}
                itemsPerPage={filters.limit}
                onPageChange={handlePageChange}
                label="Students"
            />
        </div>
    );
};

export default ManageUsers;
