import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { adminAxios } from "../../../api/adminAxios";

const AdminDashboardHeader = () => {
    const [downloading, setDownloading] = React.useState(false);

    const fetchOrderDetails = async () => {
        try {
            const response = await adminAxios.get("/dashboard/orders");
            return response.data.orders || [];
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch admin order list");
            return [];
        }
    };

    const downloadPDF = async () => {
        let loadingToast;
        try {
            setDownloading(true);
            loadingToast = toast.loading("Generating Admin PDF Report...");

            const orders = await fetchOrderDetails();

            if (!orders || orders.length === 0) {
                toast.dismiss(loadingToast);
                toast.info("No orders found to download");
                return;
            }

            const doc = new jsPDF("l", "mm", "a4");

            // 1. Add Header
            doc.setFontSize(18);
            doc.setTextColor(79, 70, 229);
            doc.text("Master Order Report (Admin)", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

            const tableData = orders.map((order, index) => [
                index + 1,
                String(order.displayId || "N/A"),
                String(order.studentName || "N/A"),
                String(order.tutors || "N/A"), // Tutor Name
                String(order.courses || "N/A"),
                `INR ${order.totalAmount ?? 0}`,
                `INR ${order.adminCommission ?? 0}`, // Admin Commission
                order.date ? new Date(order.date).toLocaleDateString() : "N/A",
                String(order.status || "N/A"),
            ]);

            // 3. autoTable calling
            autoTable(doc, {
                startY: 35,
                head: [["#", "ID", "Student", "Tutor", "Courses", "Total", "Commission", "Date", "Status"]],
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    fontSize: 8,
                },
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                },
                columnStyles: {
                    4: { cellWidth: 40 }, // Courses column width
                    3: { cellWidth: 30 }, // Tutor column width
                },
            });

            doc.save(`admin-master-report-${Date.now()}.pdf`);

            toast.dismiss(loadingToast);
            toast.success("Admin PDF downloaded successfully");
        } catch (error) {
            console.error("PDF Error:", error);
            if (loadingToast) toast.dismiss(loadingToast);
            toast.error(`PDF Error: ${error.message}`);
        } finally {
            setDownloading(false);
        }
    };

    const downloadExcel = async () => {
        let loadingToast;
        try {
            setDownloading(true);
            loadingToast = toast.loading("Generating Admin Excel Report...");

            const orders = await fetchOrderDetails();

            if (orders.length === 0) {
                toast.dismiss(loadingToast);
                toast.info("No orders found to download");
                return;
            }

            const excelData = orders.map((order, index) => ({
                "S.No": index + 1,
                "Order ID": order.displayId || "N/A",
                "Student Name": order.studentName || "N/A",
                "Student Email": order.studentEmail || "N/A",
                "Tutor(s)": order.tutors || "N/A",
                "Course(s)": order.courses || "N/A",
                "Gross Total (INR)": order.totalAmount ?? 0,
                "Admin Commission (INR)": order.adminCommission ?? 0,
                "Tutor Share (INR)": order.tutorShare ?? 0,
                "Tax (INR)": order.tax ?? 0,
                "Payment Method": order.paymentGateway || "N/A",
                Date: order.date ? new Date(order.date).toLocaleDateString() : "N/A",
                Status: order.status || "N/A",
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Master Orders");

            const wscols = [
                { wch: 5 },
                { wch: 15 },
                { wch: 20 },
                { wch: 25 },
                { wch: 20 },
                { wch: 30 },
                { wch: 15 },
                { wch: 18 },
                { wch: 15 },
                { wch: 10 },
                { wch: 15 },
                { wch: 12 },
                { wch: 10 },
            ];
            ws["!cols"] = wscols;

            XLSX.writeFile(wb, `admin-sales-report-${Date.now()}.xlsx`);

            toast.dismiss(loadingToast);
            toast.success("Admin Excel downloaded successfully");
        } catch (error) {
            console.error("Excel Error:", error);
            if (loadingToast) toast.dismiss(loadingToast);
            toast.error("Failed to generate Admin Excel");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="mb-8 w-full">
            {/* Main Header Container: Stacks on mobile, side-by-side on md+ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                {/* Title Section */}
                <div className="text-center md:text-left flex-1">
                    <div className="inline-block">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1E2EDE] tracking-tighter uppercase leading-none">
                            Admin <span className="text-[#14C4E7]">Dashboard</span>
                        </h2>
                        {/* Decorative bar - centered on mobile, left-aligned on md */}
                        <div className="h-1.5 w-12 md:w-20 bg-[#E6D929] mt-2 rounded-full mx-auto md:mx-0"></div>
                    </div>

                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mt-3">
                        Platform-wide sales and financial reports.
                    </p>
                </div>

                {/* Action Buttons Group: Full width on mobile, auto width on md */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={downloadPDF}
                        disabled={downloading}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">PDF Report</span>
                    </button>

                    <button
                        onClick={downloadExcel}
                        disabled={downloading}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-green-50 text-green-600 rounded-xl border border-green-100 hover:bg-green-100 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Excel Export</span>
                    </button>
                </div>
            </div>

            {/* Optional: Thin separator line for better visual structure */}
            <div className="w-full h-px bg-slate-100 mt-8"></div>
        </div>
    );
};

export default AdminDashboardHeader;
