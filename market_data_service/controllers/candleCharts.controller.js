import { getHistoricalData, getIntraDayData } from "../marketDataAPI/getCandleChartData.js";

export const getHistoricalDataHandler = (req, res) => {
    console.log("Getting Historical Data");
    const symbol = req.query.symbol;
    const filter = req.query.filter;
    getHistoricalData(symbol, filter, (err, data) => {
        if (err) {
            res.status(500).json("failed")
        } else {
            res.status(200).json(data)
        }
    });
 }

 export const getIntraDayCandleDataHandler = (req, res) => {
    console.log("Getting Intraday Data");
    const symbol = req.query.symbol;
    getIntraDayData(symbol, (err, data) => {
        if (err) {
            res.status(500).json("failed")
        } else {
            res.status(200).json(data)
        }
    });
 }