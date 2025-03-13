import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

import boostRoute from "./routes/boostRoute";
import freeboxRoute from "./routes/freeboxRoute";
import gameRoute from "./routes/gameRoute";
import miningRoute from "./routes/miningRoute";
import preadminRoute from "./routes/preAdminRoute";
import profileRoute from "./routes/profileRoute";
import referralRoute from "./routes/referralRoute";
import raffleRoute from "./routes/raffleRoute";
import rouletteRoute from "./routes/rouletteRoute";
import walletRoute from "./routes/walletRoute";
import walletHistoryRoute from "./routes/walletHistoryRoute";
import questRoute from "./routes/questRoute";
// import "./utils/batchSchedule";
import { pearlRaffleChooseBatch, shellRaffleChooseBatch, pearlRaffleCreateBatch, shellRaffleCreateBatch } from "./utils/batchSchedule";
export { pearlRaffleChooseBatch, shellRaffleChooseBatch, pearlRaffleCreateBatch, shellRaffleCreateBatch }

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
        },
        tags: [
            {
                name: "boost",
                description: "Boost API",
            },
            {
                name: "freebox",
                description: "Freebox API",
            },
            {
                name: "game",
                description: "Game API",
            },
            {
                name: "mining",
                description: "Mining API",
            },
            {
                name: "preadmin",
                description: "PreAdmin API",
            },
            {
                name: "profile",
                description: "Profile API",
            },
            {
                name: "referral",
                description: "Referral API",
            },
            {
                name: "raffle",
                description: "Raffle API",
            },
            {
                name: "roulette",
                description: "Roulette API",
            },
            {
                name: "wallet",
                description: "Wallet API",
            },
            {
                name: "walletHistory",
                description: "Wallet History API",
            },
            {
                name: "quest",
                description: "Quest API",
            }
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJSDoc(options);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,  // 모든 출처 허용
    credentials: true  // 인증 정보 허용
}));
app.use('/boost', boostRoute);
app.use('/freebox', freeboxRoute);
app.use('/game', gameRoute);
app.use('/mining', miningRoute);
app.use('/preadmin', preadminRoute);
app.use('/profile', profileRoute);
app.use('/referral', referralRoute);
app.use('/raffle', raffleRoute);
app.use('/roulette', rouletteRoute);
app.use('/wallet', walletRoute);
app.use('/wallethistory', walletHistoryRoute);
app.use('/quest', questRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res)=>{
    res.send("health check is ok")
})

export const seapearl = onRequest({
    region: "us-central1",
    minInstances: 1,
    timeoutSeconds: 900
}, app);

// app.listen(3000, () => {
//     console.log("Server is running on http://localhost:3000");
// });