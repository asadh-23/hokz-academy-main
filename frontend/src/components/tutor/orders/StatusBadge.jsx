import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
    const statusConfig = {
        paid: {
            icon: CheckCircle,
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
            label: "PAID"
        },
        pending: {
            icon: Clock,
            className: "bg-amber-100 text-amber-700 border-amber-200",
            label: "PENDING"
        },
        failed: {
            icon: XCircle,
            className: "bg-red-100 text-red-700 border-red-200",
            label: "FAILED"
        },
        cancelled: {
            icon: AlertCircle,
            className: "bg-gray-100 text-gray-700 border-gray-200",
            label: "CANCELLED"
        }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};

export default StatusBadge;