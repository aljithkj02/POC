import { WebSocket, WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8000 });

let senderSocker: null | WebSocket = null;
let receiverSocker: null | WebSocket = null;

wss.on('connection', (ws) => {
    ws.on('message', (data: any) => {
        const message = JSON.parse(data);
        console.log({message})

        if (message.type === "IDENTIFY_AS_SENDER") {
            senderSocker = ws;
        } else if (message.type === "IDENTIFY_AS_RECEIVER") {
            receiverSocker = ws;
        } else if (message.type === "CREATE_OFFER") {
            receiverSocker?.send(JSON.stringify({ type: "OFFER", sdp: message.data }));
        } else if (message.type === "CREATE_ANSWER") {
            senderSocker?.send(JSON.stringify({ type: "ANSWER", sdp: message.data }));
        } else if (message.type === 'ICE_CANDIDATE') {
            if (senderSocker === ws) {
                receiverSocker?.send(JSON.stringify({ type: "ICE_CANDIDATE", ice: message.data }));
            } else if (receiverSocker === ws) {
                senderSocker?.send(JSON.stringify({ type: "ICE_CANDIDATE", ice: message.data }));
            }
        }
    })
})