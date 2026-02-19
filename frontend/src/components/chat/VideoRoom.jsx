import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { selectTutor } from "../../store/features/auth/tutorAuthSlice";
import { useSocket } from "../../contexts/SocketContext";
import { toast } from "sonner";

const VideoRoom = () => {
    const { roomId } = useParams();
    const { socket } = useSocket();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const zpRef = useRef(null);

    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutor);
    const currentUser = user || tutor;
    
    useEffect(() => {
        if (!socket) return;

        const handleCallRejected = ({ name }) => {
            toast.error(`Call Rejected`, {
                description: `${name} rejected the call.`,
                duration: 4000,
            });

            if (zpRef.current) {
                zpRef.current.destroy();
                zpRef.current = null;
            }

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        };

        socket.on("call-rejected", handleCallRejected);
        return () => socket.off("call-rejected", handleCallRejected);
    }, [socket, navigate]);

    useEffect(() => {
        let isMounted = true;

        const initMeeting = async () => {
            if (zpRef.current) return;
            const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
            const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

            if (!appID || !serverSecret || !containerRef.current) return;

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                currentUser?._id?.toString() || Date.now().toString(),
                currentUser?.fullName || "Hokz User",
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zpRef.current = zp;

            zp.joinRoom({
                container: containerRef.current,
                scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                showScreenSharingButton: true,
                onLeaveRoom: () => {
                    if (isMounted) {
                        zp.destroy();
                        zpRef.current = null;
                        navigate(-1);
                    }
                },
            });
        };

        // Give React a tiny breath to attach the Ref to DOM
        const timeoutId = setTimeout(() => {
            initMeeting();
        }, 50);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            if (zpRef.current) {
                zpRef.current.destroy();
                zpRef.current = null;
            }
        };
    }, [roomId, navigate, currentUser]);

    return (
        <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
            {/* Branding Overlay */}
            <div className="absolute top-5 left-5 z-50 flex items-center gap-2 pointer-events-none">
                <div className="bg-cyan-600 p-2 rounded-lg shadow-lg">
                    <span className="text-white font-bold text-lg tracking-tighter">Hokz</span>
                </div>
                <span className="text-white/70 font-medium text-sm">Academy Live Room</span>
            </div>

            {/* 🔥 Video Container */}
            <div className="w-full h-full" ref={containerRef} />
        </div>
    );
};

export default VideoRoom;
