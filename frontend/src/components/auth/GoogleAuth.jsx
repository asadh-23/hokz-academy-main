import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import { googleAuth, selectGoogleAuthLoading } from "../../store/features/auth/googleAuthSlice";
// Role-specific login actions
import { userLoginSuccess } from "../../store/features/auth/userAuthSlice";
import { tutorLoginSuccess } from "../../store/features/auth/tutorAuthSlice";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleAuth({ role }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selector for loading state
    const isLoading = useSelector(selectGoogleAuthLoading);

    const handleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded); // contains name, email, picture, etc.

            // Dispatch Redux thunk instead of direct axios call
            const result = await dispatch(
                googleAuth({
                    credential: credentialResponse.credential,
                    role,
                })
            ).unwrap();

            toast.success(result.message || "Google login successful!");

            // Prepare payload for role-specific auth slice
            const payload = {
                user: result.user,
                accessToken: result.accessToken,
            };

            // Update the appropriate role-based auth slice
            if (role === "user") dispatch(userLoginSuccess(payload));
            if (role === "tutor") dispatch(tutorLoginSuccess(payload));

            navigate(`/${role}/dashboard`, { replace: true });
        } catch (error) {
            console.error("Google login failed:", error);
            toast.error(error || "Google login failed");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="flex justify-center mt-6">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => toast.error("Google login failed")}
                    shape="pill"
                    text="signin_with"
                    size="large"
                    disabled={isLoading}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{
                        background: "linear-gradient(90deg, #b8860b 0%, #008080 100%)",
                        border: "2px solid #805a00", // dark golden border color
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "9999px",
                        width: "280px",
                        boxShadow: "0 8px 20px rgba(184, 134, 11, 0.6)",
                        opacity: isLoading ? 0.6 : 1,
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
}
