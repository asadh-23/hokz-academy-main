import React from "react";
import { TrendingUp, Wallet, ShoppingBag, CreditCard } from "lucide-react";

const OrderStats = ({ stats }) => {
    
    // Currency Formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const statCards = [
        {
            title: "Net Earnings",
            subtitle: "Credited to wallet",
            value: formatCurrency(stats?.totalEarnings || 0),
            icon: Wallet, // Wallet icon is better for earnings
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            title: "Total Sales Volume",
            subtitle: "Gross amount paid by students",
            value: formatCurrency(stats?.totalSales || 0), // Added Currency Format here
            icon: CreditCard, // CreditCard or TrendingUp for sales volume
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100"
        },
        {
            title: "Total Orders",
            subtitle: "Successful enrollments",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={index} 
                        className={`bg-white rounded-2xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {/* Optional: You can add a small badge here if needed */}
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1 tracking-tight">
                                {stat.value}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                {stat.subtitle}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderStats;