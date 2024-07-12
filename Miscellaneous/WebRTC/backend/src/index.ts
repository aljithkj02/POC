import { WebSocket, WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8000 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', (ws) => {
    ws.on('message', (data: any) => {
        const message = JSON.parse(data);

        if (message.type === "IDENTIFY_AS_SENDER") {
            senderSocket = ws;
        } else if (message.type === "IDENTIFY_AS_RECEIVER") {
            receiverSocket = ws;
        } else if (message.type === "CREATE_OFFER") {
            receiverSocket?.send(JSON.stringify({ type: "OFFER", sdp: message.data }));
        } else if (message.type === "CREATE_ANSWER") {
            senderSocket?.send(JSON.stringify({ type: "ANSWER", sdp: message.data }));
        } else if (message.type === 'ICE_CANDIDATE') {
            if (senderSocket === ws) {
                receiverSocket?.send(JSON.stringify({ type: "ICE_CANDIDATE", candidate: message.data }));
            } else if (receiverSocket === ws) {
                senderSocket?.send(JSON.stringify({ type: "ICE_CANDIDATE", candidate: message.data }));
            }
        }
    })
})