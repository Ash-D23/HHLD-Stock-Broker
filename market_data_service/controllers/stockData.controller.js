import { getHoldings, getMarketQuoteOHLC, getPositions } from "../marketDataAPI/getStockData.js";

 export const getOHLCHandler = (req, res) => {
    const { symbol, accessToken } = req.body;
    getMarketQuoteOHLC(symbol, accessToken, (err, data) => {
        if (err) {
            res.status(500).json("failed")
        } else {
            const obj = data.data
            const result = Object.keys(obj).map((key) => [key, obj[key]])
            res.status(200).json(result[0][1])
        }
    });
 }

 export const getHoldingsHandler = (req, res) => {
    console.log("Getting Holding route");
    const { accessToken } = req.body

    getHoldings((err, data) => {
        if (err) {
            res.status(500).json("failed")
        } else {
            res.status(200).json(data)
        }
    }, accessToken);
 }

 export const getPositionsHandler = (req, res) => {
    console.log("Getting Positions route");
    const { accessToken } = req.body

    getPositions((err, data) => {
        if (err) {
            res.status(500).json("failed")
        } else {
            res.status(200).json(data)
        }
    }, accessToken);
 }