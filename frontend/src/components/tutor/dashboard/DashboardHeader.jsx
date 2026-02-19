import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable directly
import * as XLSX from "xlsx";
import { tutorAxios } from "../../../api/tutorAxios";

const DashboardHeader = () => {
    const [downloading, setDownloading] = React.useState(false);

    const fetchOrderDetails = async () => {
        try {
            // Pointing to your new dedicated export route
            const response = await tutorAxios.get("/dashboard/orders");
            // Your new controller returns: { success: true, orders: [...] }
            return response.data.orders || [];
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch full order list");
            return [];
        }
    };

    const downloadPDF = async () => {
        let loadingToast;
        try {
            setDownloading(true);
            loadingToast = toast.loading("Generating PDF...");

            const orders = await fetchOrderDetails();

            if (!orders || orders.length === 0) {
                toast.dismiss(loadingToast);
                toast.info("No orders found to download");
                return;
            }

            const doc = new jsPDF();

            // 1. Add Header
            doc.setFontSize(18);
            doc.setTextColor(79, 70, 229);
            doc.text("Order Details Report", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

            // 2. Prepare Data
            const tableData = orders.map((order, index) => [
                index + 1,
                String(order.displayId || "N/A"),
                String(order.studentName || "N/A"),
                String(order.courses || "N/A"),
                `INR ${order.netEarnings ?? 0}`,
                order.date ? new Date(order.date).toLocaleDateString() : "N/A",
                String(order.status || "N/A"),
            ]);

            // 3. Call autoTable DIRECTLY (This fixes the "not a function" error)
            autoTable(doc, {
                startY: 35,
                head: [["#", "Order ID", "Student", "Course", "Amount", "Date", "Status"]],
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                columnStyles: {
                    3: { cellWidth: 50 }, // Course column
                },
            });

            // 4. Save
            doc.save(`orders-report-${new Date().getTime()}.pdf`);

            toast.dismiss(loadingToast);
            toast.success("PDF downloaded successfully");
        } catch (error) {
            console.error("PDF Generation Error:", error);
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
            loadingToast = toast.loading("Generating Excel...");

            const orders = await fetchOrderDetails();

            if (orders.length === 0) {
                toast.dismiss(loadingToast);
                toast.info("No orders found to download");
                return;
            }

            // UPDATED MAPPING: Matching your new controller fields
            const excelData = orders.map((order, index) => ({
                "S.No": index + 1,
                "Order ID": order.displayId || "N/A",
                "Student Name": order.studentName || "N/A",
                "Student Email": order.studentEmail || "N/A",
                "Course(s)": order.courses || "N/A",
                "My Earnings (INR)": order.netEarnings ?? 0,
                "Total Value (INR)": order.totalValue ?? 0,
                "Tax Collected": order.tax ?? 0,
                Date: order.date ? new Date(order.date).toLocaleDateString() : "N/A",
                Status: order.status || "N/A",
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Orders");
            XLSX.writeFile(wb, `orders-${Date.now()}.xlsx`);

            toast.dismiss(loadingToast);
            toast.success("Excel downloaded successfully");
        } catch (error) {
            console.error("Excel Error:", error);
            if (loadingToast) toast.dismiss(loadingToast);
            toast.error("Failed to generate Excel");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Instructor Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">Full detailed report export available below.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-200 hover:bg-red-100 disabled:opacity-50"
                    >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                    </button>

                    <button
                        onClick={downloadExcel}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl border border-green-200 hover:bg-green-100 disabled:opacity-50"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Excel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
