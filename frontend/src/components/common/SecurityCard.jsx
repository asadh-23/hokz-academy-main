// Reusable Security Settings Card Component
export default function SecurityCard({ onEmailChange, onPasswordChange }) {
    return (
        <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto mt-8 shadow-xl border border-gray-100">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-5 md:mb-6 border-b pb-3 border-gray-200">
                Security Settings
            </h3>

            <div className="space-y-4 md:space-y-5">
                {/* Change Email - Only show if onEmailChange is provided */}
                {onEmailChange && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-800">Change Email</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Update the email linked to your account.
                            </p>
                        </div>
                        <button
                            onClick={onEmailChange}
                            className="mt-2 sm:mt-0 w-full sm:w-auto bg-gray-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-gray-700 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Change Email
                        </button>
                    </div>
                )}

                {/* Change Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <p className="font-medium text-gray-800">Change Password</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Set a new password for your account.
                        </p>
                    </div>
                    <button
                        onClick={onPasswordChange}
                        className="mt-2 sm:mt-0 w-full sm:w-auto bg-gray-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-gray-700 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
