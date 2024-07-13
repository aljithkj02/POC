import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const Layout = () => {
  return (
    <div>
        <Navbar />

        <div>
            <Outlet />
        </div>
    </div>
  )
}
