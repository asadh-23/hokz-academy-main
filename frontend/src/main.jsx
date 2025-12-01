import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { setStoreRef } from "./api/setupInterceptors";

// Set store reference for interceptors to avoid circular dependency
setStoreRef(store);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
            <Toaster
                position="top-right"
                richColors={true}
                closeButton
                toastOptions={{
                    duration: 5000,
                    style: {
                        fontSize: "16px",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    },
                }}
            />
        </BrowserRouter>
    </StrictMode>
);
