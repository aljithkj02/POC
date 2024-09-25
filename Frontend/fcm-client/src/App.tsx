import { getToken, NotificationPayload, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import './App.css'
import { messaging } from './firebase/config';
import axios from 'axios';

const VAPID_KEY = import.meta.env.VITE_APP_VAPID_KEY;
const URL = 'http://localhost:3000';

function App() {

  useEffect(() => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
        requestPermission();
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      })
  
      console.log("Token generated : ", token);
      const res = await axios.post(URL + '/save-token', { token });
      console.log(res.data);
    } else {
      toast.error("You denied for the notification");
    }
  }

  onMessage(messaging, (payload) => {
    console.log({payload});
    const { title , body } = payload.notification as NotificationPayload;
    toast.success(body as string);
  })

  return (
    <div>
      <p className='text-xl'>Hello</p>
    </div>
  )
}

export default App
