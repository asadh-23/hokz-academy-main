import React, { useState, useEffect } from "react";
import StudentStatsCards from "../../components/admin/students/StudentStatsCards";
import StudentTable from "../../components/admin/students/StudentTable";
import Pagination from "../../components/admin/Pagination";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { toast } from "sonner";
import { adminAxios } from "../../api/adminAxios";

const ManageUsers = () => {
    // -------------------- STATE --------------------
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Students");
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(5);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalFilteredUsers: 0,
    });

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        blocked: 0,
        inactive: 0,
    });

    // -------------------- FETCH USERS --------------------
    const fetchStudents = async (showLoader = false) => {
        if (showLoader) setIsLoading(true);

        try {
            const response = await adminAxios.get("/users", {
                params: {
                    page: currentPage,
                    limit: studentsPerPage,
                    search: searchTerm,
                    status: filterStatus === "All Students" ? "" : filterStatus,
                },
            });

            if (response.data?.success) {
                setStudents(response.data.users);
                setPagination(response.data.pagination);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error(error.response?.data?.message || "Failed to load students");
        } finally {
            if (showLoader) setIsLoading(false);
        }
    };

    // -------------------- EFFECTS --------------------

    // ✅ Initial load only once
    useEffect(() => {
        fetchStudents(true);
    }, []);

    // ✅ Re-fetch when page, filter, or search changes
    useEffect(() => {
        fetchStudents();
    }, [currentPage, filterStatus, searchTerm]);

    // ✅ Debounced search (only resets page number)
    useEffect(() => {
        const delay = setTimeout(() => setCurrentPage(1), 600);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    // -------------------- HANDLERS --------------------
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilterChange = (e) => setFilterStatus(e.target.value);
    const handlePageChange = (page) => setCurrentPage(page);

    const handleRefresh = () => {
        setSearchTerm("");
        setFilterStatus("All Students");
        setCurrentPage(1);
        fetchStudents();
    };

    // -------------------- ACTION HANDLERS --------------------
    const handleBlockStudent = async (userId) => {
        const user = students.find((s) => s._id === userId);
        const userName = user?.fullName || "this student";

        toast.warning(`Are you sure you want to block ${userName}?`, {
            action: {
                label: "Block",
                onClick: async () => {
                    try {
                        const response = await adminAxios.patch(`/users/${userId}/block`);
                        if (response.data?.success) {
                            toast.success(response.data?.message || `${userName} has been blocked successfully`);
                            fetchStudents();
                        }
                    } catch (error) {
                        console.error("Failed to block user:", error);
                        toast.error(error.response?.data?.message || "Block request failed");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => {},
            },
        });
    };

    const handleUnblockStudent = async (userId) => {
        try {
            const response = await adminAxios.patch(`/users/${userId}/unblock`);
            if (response.data?.success) {
                toast.success(response.data?.message || "User unblocked successfully");
                fetchStudents();
            }
        } catch (error) {
            console.error("Failed to unblock user:", error);
            toast.error(error.response?.data?.message || "Unblock request failed");
        }
    };

    // -------------------- RENDER --------------------
    if (isLoading) {
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
                            value={filterStatus}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="All Students">All Students</option>
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
            <StudentTable students={students} onBlockStudent={handleBlockStudent} onUnblockStudent={handleUnblockStudent} />

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalFilteredUsers}
                itemsPerPage={studentsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ManageUsers;
