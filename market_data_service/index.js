import express from 'express';
import dotenv from "dotenv"
import UpstoxClient from "upstox-js-sdk";
import cors from "cors";
import stocksRouter from "./routes/stocks.routes.js"
import marketDataRouter from "./routes/marketData.routes.js"
import getMarketDataFeed from './marketDataAPI/getMarketData.js';
import stockDataRouter from './routes/stockData.routes.js'
import chartRouter from './routes/charts.route.js'
import http from "http";
import { Server } from "socket.io";
import axios from 'axios';

dotenv.config();
const app = express();

app.use(cors())

app.use(express.json())
const port = 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
    }
})

io.on('connection', (socket) => {
    socket.on('market data', (instrumentKeys, accessToken) => {

        getMarketDataFeed(instrumentKeys , accessToken, (data) => {
            socket.emit('market data', data)
        })
    })
})
 
 app.post('/getAccessToken', (req, res) => {
    const { code }  = req.body

    if(!code){
        res.status(500).json({ message: "No Auth Code"})
        return
    }
    
    const url = process.env.upstoxURL;
    const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    };

    const data = {
        'code': code,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.REDIRECT_URI,
        'grant_type': 'authorization_code',
    };

    axios.post(url, new URLSearchParams(data), { headers })
    .then(response => {
        res.status(200).json(response.data)
    })
    .catch(error => {
        res.status(500).json({ message: "an error occured"})
    });
    
    // const result = loginToUpstox(code);
    // if(result){
    //     res.status(200).json({ token: result });
    // }else{
    //     res.status(500).json({ message: "An error occured"})
    // }
 });

 app.post('/logout', (req, res) => {

    const { accessToken } = req.body

    let defaultClient = UpstoxClient.ApiClient.instance;

    let OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = accessToken;

    let apiInstance = new UpstoxClient.LoginApi();
    let apiVersion = "2.0";

    apiInstance.logout(apiVersion, (error, data, response) => {
        if (error) {
            res.status(500).json({ message: error.message})
        } else {
            res.status(200).json(data)
        }
    });
 })

 
//  const loginToUpstox = (code) => {
//     const apiInstance = new UpstoxClient.LoginApi();
//     const apiVersion = "2.0";
//     const opts = {
//         code: code,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         redirectUri: process.env.REDIRECT_URI,
//         grantType: "authorization_code",
//     };
//     console.log(opts)
//     apiInstance.token(apiVersion, opts, (error, data, response) => {
//         if (error) {
//             console.log("Error occurred: ", error);
//             return null
//         } else {
//             console.log(data)
//             return data["accessToken"]
//         }
//     });
//  };

 app.use("/stock", stockDataRouter)

 app.use("/chart", chartRouter)

 app.use('/stocks', stocksRouter);

 app.use('/marketData', marketDataRouter);

 app.get('/', async (req, res) => {
    res.json({ message: "HHLD Stock Broker Order Executioner Service" });
 });
 
 server.listen(port, (req, res) => {
    console.log(`Server is running at ${port}`);
 })