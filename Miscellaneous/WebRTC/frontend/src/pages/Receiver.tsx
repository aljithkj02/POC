import { useEffect, useRef } from "react";

export const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "IDENTIFY_AS_RECEIVER"
      }))
    }

    const pc = new RTCPeerConnection();

    socket.onmessage = async (ev) => {
      const message = JSON.parse(ev.data);
      if (message.type === 'OFFER') {
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(JSON.stringify({
          type: "CREATE_ANSWER",
          data: pc.localDescription
        }));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(JSON.stringify({ 
              type: "ICE_CANDIDATE",
              data: event.candidate
            }))
          }
        }
      } else if (message.type === "ICE_CANDIDATE") {
        pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    }

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
        videoRef.current.controls = true;

        videoRef.current && videoRef.current.play();
      }
    }
  }, [])

  return (
    <div className="p-10">
      <p className="text-3xl text-center">Receiver</p>
      <video autoPlay width={500} ref={videoRef}></video>
    </div>
  )
}
