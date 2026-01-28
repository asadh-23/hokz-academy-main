import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";

// Import new components
import OrderStats from "../../components/tutor/orders/OrderStats";
import OrderFilters from "../../components/tutor/orders/OrderFilters";
import OrderTable from "../../components/tutor/orders/OrderTable";
import OrderDetailsModal from "../../components/tutor/orders/OrderDetailsModal";
import OrderEmptyState from "../../components/tutor/orders/OrderEmptyState";
import { tutorAxios } from "../../api/tutorAxios";

const TutorOrders = () => {
    // State management
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch orders and stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const ordersResponse = await tutorAxios.get("/orders");

                if (ordersResponse.data.success) {
                    setOrders(ordersResponse.data.data);
                }
            } catch (error) {
                console.error("Fetch Orders Error:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = useMemo(() => {
        const totalEarnings = orders.reduce((acc, order) => acc + (order.payment.tutorEarning || 0), 0);
        const totalSales = orders.reduce((acc, order) => acc + (order.payment.soldPrice || 0), 0);
        const totalOrders = orders.length;

        return { totalEarnings, totalSales, totalOrders };
    }, [orders]);

    // Filter orders based on search and filters
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.course.title.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter;

            // Date filter
            let matchesDate = true;
            if (dateRange !== "all") {
                const orderDate = new Date(order.orderDate);
                const now = new Date();

                switch (dateRange) {
                    case "today":
                        matchesDate = orderDate.toDateString() === now.toDateString();
                        break;
                    case "week":
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        matchesDate = orderDate >= weekAgo;
                        break;
                    case "month":
                        matchesDate =
                            orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                        break;
                    case "quarter":
                        const quarter = Math.floor(now.getMonth() / 3);
                        const orderQuarter = Math.floor(orderDate.getMonth() / 3);
                        matchesDate = orderQuarter === quarter && orderDate.getFullYear() === now.getFullYear();
                        break;
                    default:
                        matchesDate = true;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [orders, searchTerm, statusFilter, dateRange]);

    // Event handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setDateRange("all");
    };

    const hasActiveFilters = searchTerm || statusFilter !== "all" || dateRange !== "all";

    const handleExport = () => {
        // 1. Check if data exists
        if (!filteredOrders || filteredOrders.length === 0) {
            toast.error("No orders to export");
            return;
        }

        // 2. Define CSV Headers
        const headers = [
            "Order ID",
            "Date",
            "Student Name",
            "Student Email",
            "Course Name",
            "MRP",
            "Discount",
            "Taxable Value (Base Price)",
            "Tax (3%)",
            "Total Paid",
            "Platform Fee (10%)",
            "Net Earning",
            "Status",
        ];

        // 3. Map Data to Rows
        const rows = filteredOrders.map((order) => {
            const basePrice = order.payment?.soldPrice || 0;
            const tax = order.payment?.tax || 0;
            const totalPaid = basePrice + tax;
            const discount = order.payment?.totalDiscount || 0;

            // Escape commas in strings to avoid breaking CSV format
            const safeString = (str) => `"${str ? str.replace(/"/g, '""') : ""}"`;

            return [
                order.displayId,
                new Date(order.orderDate).toLocaleDateString("en-IN"),
                safeString(order.student?.name),
                safeString(order.student?.email),
                safeString(order.course?.title),
                order.payment?.mrp || 0,
                discount,
                basePrice, // Taxable Value
                tax, // Tax
                totalPaid, // Total Paid
                order.payment?.platformFee || 0,
                order.payment?.tutorEarning || 0,
                order.status,
            ].join(",");
        });

        // 4. Combine Headers and Rows
        const csvContent = [headers.join(","), ...rows].join("\n");

        // 5. Create Download Link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Tutor_Orders_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);

        // 6. Trigger Download & Cleanup
        link.click();
        document.body.removeChild(link);
        toast.success("Orders exported successfully");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <PageLoader text="Loading orders..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">Track your course sales, monitor earnings, and manage student orders.</p>
                </div>

                {/* Stats Cards */}
                {stats && <OrderStats stats={stats} />}

                {/* Filters */}
                <OrderFilters
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusChange={handleStatusChange}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    onExport={handleExport}
                />

                {/* Orders Table or Empty State */}
                {filteredOrders.length > 0 ? (
                    <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} loading={false} />
                ) : (
                    <OrderEmptyState hasFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
                )}

                {/* Order Details Modal */}
                <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
            </div>
        </div>
    );
};

export default TutorOrders;
