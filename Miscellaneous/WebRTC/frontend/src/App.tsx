
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Receiver } from './pages/Receiver'
import { Sender } from './pages/Sender'

const router = createBrowserRouter([
  {
    path: '/receiver',
    element: <Receiver />
  },
  {
    path: '/sender',
    element: <Sender />
  }
])

function App() {

  return (
    <RouterProvider router={router}  />
  )
}

export default App
