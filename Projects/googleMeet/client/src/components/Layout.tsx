import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Toaster } from "react-hot-toast"
import { useWs } from "../hooks/useWs"

export const Layout = () => {
  useWs();
  
  return (
    <div>
        <Navbar />

        <div>
            <Outlet />
        </div>
        <Toaster />
    </div>
  )
}
