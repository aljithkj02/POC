import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: 'json'};

const tokenStore = new Set();
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to my server!"
    })
})

app.post('/save-token', (req, res) => {
    tokenStore.add(req.body.token);
    res.json({
        status: true,
        message: "Successfully added token"
    })
})

app.get('/send', async (req, res) => {
    const tokens = Array.from(tokenStore);

    tokens.forEach(async (token) => {
        const payload = {
            notification: {
              title: "This is the title",
              body: "Hello buddy here your notification!",
            },
            token,
        };

       await admin.messaging().send(payload);
    })

    res.json({
        status: true,
        message: "Successfully send the notification!"
    })
})

app.listen(3000, () => {
    console.log("Server has started on port: 3000");
})