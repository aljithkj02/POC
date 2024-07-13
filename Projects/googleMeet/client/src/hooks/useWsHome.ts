import { useNavigate } from "react-router-dom";
import { wsManager } from "../managers/ws.manager";
import { MessageTypes } from "../types";
import toast from "react-hot-toast";

type WsHomeReturnType = [ () => void, (id: string) => void ]

export const useWsHome = (): WsHomeReturnType => {

    const navigate = useNavigate();

    wsManager.getSocket().onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === MessageTypes.JOIN_ID) {
            navigate(`/room/${message.data}`);
        } else if (message.type === MessageTypes.ERROR) {
            toast.dismiss();
            toast.error(message.message);
        } else if (message.type === MessageTypes.JOIN_SUCCESSFUL) {
            navigate(`/viewer`);
        }
    }

    const handleNewMeeting = () => {
        wsManager.createRoom();
    }

    const handleJoinRoom = (id: string) => {
        wsManager.joinRoom(id);
    }

    return [handleNewMeeting, handleJoinRoom];
}