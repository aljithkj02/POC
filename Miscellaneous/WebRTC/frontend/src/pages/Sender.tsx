import { useEffect, useRef, useState } from "react"

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "IDENTIFY_AS_SENDER"
      }))
    }

    setSocket(socket);
  }, [])

  const handleSendVideo = async () => {
    if (!socket) {
      alert('No socket!');
      return;
    }

    socket.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      if (message.type === 'ANSWER') {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
      } else if (message.type === "ICE_CANDIDATE") {
        pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    }

    const pc = new RTCPeerConnection(); 

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      socket.send(JSON.stringify({
        type: "CREATE_OFFER",
        data: pc.localDescription
      }))
    }


    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ 
          type: "ICE_CANDIDATE",
          data: event.candidate
        }))
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    pc.addTrack(stream.getVideoTracks()[0], stream);

    if(videoRef.current){
        videoRef.current.srcObject = stream;

        setTimeout(() => {
            videoRef.current && videoRef.current.play();
        }, 1000);
    }
  }

  return (
    <div className="p-10">
      <p className="text-3xl text-center">Sender</p>
      <div className="flex justify-end">
        <button className="text-white bg-blue-500 px-3 py-2 rounded-md"
          onClick={handleSendVideo}
        >
          Send Video
        </button>
      </div>
      <video width={500} ref={videoRef}></video>
    </div>
  )
}
