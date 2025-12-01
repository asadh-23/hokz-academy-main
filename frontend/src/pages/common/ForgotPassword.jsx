import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, selectForgotPasswordLoading } from "../../store/features/auth/passwordSlice";
import { validateEmail } from "../../utils/validation";

export default function ForgotPassword({ role }) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectForgotPasswordLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return toast.error(emailValidation.message || "Enter a valid email");
        }

        const result = await dispatch(forgotPassword({ email: emailValidation.email, role }));

        if (forgotPassword.fulfilled.match(result)) {
            toast.success(result.payload?.message || "Check your email for reset link");
            navigate(`/${role}/login`);
        } else {
            toast.error(result.payload || "Something went wrong please try again");
            navigate(`/${role}/login`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-teal-100 via-teal-50 to-teal-100 px-4">
            <div className="w-full max-w-md rounded-3xl shadow-2xl bg-white px-10 py-8 flex flex-col items-center mt-20 transform transition-transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 drop-shadow-md text-center">Forgot your password?</h2>
                <p className="text-gray-500 text-sm mb-8 text-center px-8">
                    No worries! Enter your email and we’ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-4 focus:ring-teal-300 transition text-gray-700"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400">
                            <i className="fas fa-envelope" />
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-400 text-white font-bold text-lg py-3 rounded-full shadow-lg hover:bg-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="text-xs text-gray-400 mt-6 text-center">
                    <span>
                        Remembered your password?{" "}
                        <span
                            className="text-teal-500 cursor-pointer font-semibold hover:underline"
                            onClick={() => navigate(`/${role}/login`)}
                        >
                            Login here
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
