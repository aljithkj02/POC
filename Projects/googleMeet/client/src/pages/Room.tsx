import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useWsRoom } from "../hooks/useWsRoom";

export const Room = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { id } = useParams();
  useWsRoom(id as string);

  useEffect(() => {
    startStreaming();
  }, [])

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    if(videoRef.current){
        videoRef.current.srcObject = stream;

        videoRef.current && videoRef.current.play();
    }
  }

  return (
    <div className="w-full h-[91.9vh] flex flex-col items-center">
        <p className="text-center py-3 text-xl font-semibold text-blue-700">{id}</p>
        <video width={700} ref={videoRef}></video>
    </div>
  )
}
