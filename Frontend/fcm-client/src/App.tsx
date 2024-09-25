import { getToken } from 'firebase/messaging';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import './App.css'
import { messaging } from './firebase/config';

const VAPID_KEY = import.meta.env.VITE_APP_VAPID_KEY;

function App() {

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();

    console.log({permission});
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      })
  
      console.log("Token generated : ", token);
    } else {
      toast.error("You denied for the notification");
    }
  }

  return (
    <div>
      <p className='text-xl'>Hello</p>
    </div>
  )
}

export default App
