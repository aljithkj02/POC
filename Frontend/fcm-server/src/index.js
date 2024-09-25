import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = require("./serviceAccountKey.json");

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

app.listen(3000, () => {
    console.log("Server has started on port: 3000");
})