import { MessageTypes } from "../types";

class WsManager {
    static instance: WsManager;
    private wss: WebSocket;
    private viewers: Record<number, RTCPeerConnection>;

    private constructor() {
        this.wss = new WebSocket("ws://localhost:8000");
        this.viewers = {};
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new WsManager();
        }
        return this.instance;
    }

    getSocket() {
        return this.wss;
    }

    createRoom() {
        this.wss.send(JSON.stringify({
            type: MessageTypes.CREATE_ROOM
        }))
    }

    joinRoom(id: string) {
        this.wss.send(JSON.stringify({
            type: MessageTypes.JOIN_ROOM,
            data: id
        }))
    }

    async addNewUser(userId: number, roomId: string) {
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            this.wss.send(JSON.stringify({
              type: MessageTypes.GIVE_OFFER,
              data: {
                roomId,
                userId,
                sdp: pc.localDescription
              }
            }))
        }
        this.viewers[userId] = pc;
    }
}

export const wsManager = WsManager.getInstance(); 