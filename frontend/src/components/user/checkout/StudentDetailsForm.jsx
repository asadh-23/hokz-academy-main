import { User, Phone, Mail, Info } from "lucide-react";

const StudentDetailsForm = ({ user }) => {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-100 shadow-lg">
                        <User className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none">Student Details</h2>
                        <p className="text-xs text-slate-500 mt-1">Verified account information</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                value={user?.fullName || ""}
                                readOnly
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="tel"
                                value={user?.phone || "+91 00000 00000"}
                                readOnly
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none cursor-not-allowed"
                            />
                        </div>
                        <div className="flex items-start gap-2 mt-3 px-1 text-slate-400 italic">
                            <Info className="w-3.5 h-3.5 mt-0.5" />
                            <p className="text-[11px]">Enrollment confirmation and course access credentials will be delivered to this email.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsForm;
