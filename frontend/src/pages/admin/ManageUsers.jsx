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
                }),
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
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-[#1E2EDE] tracking-tighter uppercase">
                    Student <span className="text-[#14C4E7]">Management</span>
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                    Manage all registered students
                </p>
                <div className="h-1 w-20 bg-[#E6D929] mt-4 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* ✅ Stats Section */}
            <StudentStatsCards stats={stats} />

            {/* Filters */}
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(30,46,222,0.05)] border border-slate-100 p-6 md:p-8 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Section: Title + Status Filter */}
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="relative">
                            <h2 className="text-xl md:text-2xl font-black text-[#1E2EDE] tracking-tight uppercase">
                                Student <span className="text-[#14C4E7]">Directory</span>
                            </h2>
                            <div className="h-1 w-10 bg-[#E6D929] rounded-full mt-1"></div>
                        </div>

                        <div className="relative w-full md:w-56">
                            <select
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#14C4E7]/20 focus:border-[#14C4E7] transition-all cursor-pointer"
                            >
                                <option value="All">All Students</option>
                                <option value="Active">Active Students</option>
                                <option value="Blocked">Blocked Students</option>
                                <option value="Inactive">Inactive Students</option>
                            </select>
                            {/* Custom Select Arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Search + Refresh Action */}
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                        {/* Search Box */}
                        <div className="relative w-full md:w-72 group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E2EDE] transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E2EDE]/10 focus:border-[#1E2EDE] transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#14C4E7] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#12b0d0] hover:shadow-lg hover:shadow-[#14C4E7]/20 active:scale-95 transition-all uppercase tracking-wider"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
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
