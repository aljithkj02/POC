import { WebSocket } from 'ws'
import crypto from 'crypto'
import { MessageTypes } from "../types/enums";
import { AppStoreType, GiveAnswerPayload, GiveOfferPayload, IceCandidateOwner, IceCandidateUser } from '../types/incoming.types';

class IncomingMessage {
    static instance: IncomingMessage;
    appStore: AppStoreType;
    users: Record<number, WebSocket>;
    private id: number;
    private constructor() {
        this.appStore = {};
        this.id = 1;
        this.users = {};
    }

    static getInstance() {
        if (!IncomingMessage.instance) {
            IncomingMessage.instance = new IncomingMessage();
        }
        return IncomingMessage.instance;
    }

    handleRequest(ws: WebSocket, message: any) {
        switch (message.type) {
            case MessageTypes.CREATE_ROOM:
                this.createRoom(ws);
                break;

            case MessageTypes.JOIN_ROOM:
                this.joinRoom(ws, message.data);
                break;

            case MessageTypes.GIVE_OFFER:
                this.giveOffer(ws, message.data);
                break;

            case MessageTypes.GIVE_ANSWER:
                this.giveAnswer(ws, message.data);
                break;
            
            case MessageTypes.ICE_CANDIDATE_TO_OWNER:
                this.giveIceCandidateToOwner(ws, message.data);
                break;
            
            case MessageTypes.ICE_CANDIDATE_TO_USER:
                this.giveIceCandidateToUser(ws, message.data);
                break;
        
            default:
                break;
        }
    }

    private createRoom(ws: WebSocket) {
        const key = crypto.randomBytes(10).toString('base64');

        this.appStore[key] = {
            owner: ws
        }

        ws.send(JSON.stringify({
            type: MessageTypes.JOIN_ID,
            data: key
        }))
    }

    private joinRoom(ws: WebSocket, roomId: string) {
        const room = this.appStore[roomId];
        if (!room) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such room exist!"
            }))
            return;
        }
        
        this.users[this.id] = ws;

        ws.send(JSON.stringify({
            type: MessageTypes.JOIN_SUCCESSFUL,
            data: {
                userId: this.id,
                roomId
            }
        }))
        
        room.owner.send(JSON.stringify({
            type: MessageTypes.NEW_USER,
            data: this.id
        }))
        
        this.id++;
    }

    private giveOffer(ws: WebSocket, payload: GiveOfferPayload) {
        const room = this.appStore[payload.roomId];
        if (!room) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such room exist!"
            }))
            return;
        }

        const user = this.users[payload.userId];
        if (!user) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such user exist!"
            }))
            return;
        }

        user.send(JSON.stringify({
            type: MessageTypes.RECEIVE_OFFER,
            data: payload.sdp
        }))
    }

    private giveAnswer(ws: WebSocket, payload: GiveAnswerPayload) {
        const room = this.appStore[payload.roomId];
        if (!room) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such room exist!"
            }))
            return;
        }

        room.owner.send(JSON.stringify({
            type: MessageTypes.RECEIVE_ANSWER,
            data: {
                userId: payload.userId,
                sdp: payload.sdp
            }
        }))
    }

    private giveIceCandidateToUser(ws: WebSocket, payload: IceCandidateUser) {
        const user = this.users[payload.userId];
        if (!user) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such user exist!"
            }))
            return;
        }

        user.send(JSON.stringify({
            type: MessageTypes.USER_ICE_CANDIDATE,
            data: payload.candidate
        }))
    }

    private giveIceCandidateToOwner(ws: WebSocket, payload: IceCandidateOwner) {
        const room = this.appStore[payload.roomId];
        if (!room) {
            ws.send(JSON.stringify({
                type: MessageTypes.ERROR,
                message: "No such room exist!"
            }))
            return;
        }

        room.owner.send(JSON.stringify({
            type: MessageTypes.OWNER_ICE_CANDIDATE,
            data: {
                userId: payload.userId,
                candidate: payload.candidate
            }
        }))
    }
}

export const incomingMessageInstance = IncomingMessage.getInstance();