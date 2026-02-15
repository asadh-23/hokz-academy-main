import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";

import { selectUser } from "../store/features/auth/userAuthSlice";
import { selectTutor } from "../store/features/auth/tutorAuthSlice";

import { setOnlineUsers, setSocketConnected } from '../store/features/socket/socketSlice';


const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);

    const currentUser = user || tutor;

    useEffect(() => {
        if (currentUser) {
            // --- CONNECT ---
            const socketInstance = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
                query: {
                    userId: currentUser._id,
                    role: user ? "user" : tutor ? "tutor" : "",
                },
            });

            setSocket(socketInstance);

            // Connection Status Update
            socketInstance.on("connect", () => {
                dispatch(setSocketConnected(true));
            });

            socketInstance.emit("setup", currentUser._id);

            socketInstance.on("getOnlineUsers", (users) => {
                dispatch(setOnlineUsers(users));
            });

            // --- CLEANUP ---
            return () => {
                socketInstance.close();
                dispatch(setSocketConnected(false));
                dispatch(setOnlineUsers([]));
                setSocket(null);
            };
        } else {
            // --- DISCONNECT (If logged out) ---
            if (socket) {
                socket.close();
                setSocket(null);
                dispatch(setSocketConnected(false));
                dispatch(setOnlineUsers([]));
            }
        }
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};