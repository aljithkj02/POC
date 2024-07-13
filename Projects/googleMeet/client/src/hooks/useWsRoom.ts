import { wsManager } from "../managers/ws.manager";
import { MessageTypes } from "../types";
import toast from "react-hot-toast";

export const useWsRoom = (roomId: string) => {
    wsManager.getSocket().onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === MessageTypes.ERROR) {
            toast.dismiss();
            toast.error(message.message);
        } else if (message.type === MessageTypes.NEW_USER) {
            wsManager.addNewUser(message.data, roomId);
        }
    }
}