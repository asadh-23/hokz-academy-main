import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../../contexts/SocketContext";
import { addNotification } from "../../store/features/notification/notificationSlice";


const NotificationListener = () => {
    const { socket } = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;
        const handleNewNotification = (notification) => {
            dispatch(addNotification(notification));
        };

        // Socket Event Listener On
        socket.on("new_notification", handleNewNotification);

        // Component Unmount ആകുമ്പോൾ Listener Off ചെയ്യുന്നു (Cleanup)
        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket, dispatch]);

    return null;
};

export default NotificationListener;