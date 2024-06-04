import express from "express"
import { getHoldingsHandler, getOHLCHandler, getPositionsHandler } from "../controllers/stockData.controller.js";
import { getPositions } from "../marketDataAPI/getStockData.js";

const router = express.Router();

router.post('/getOHLCData', getOHLCHandler);

router.post('/getHoldings', getHoldingsHandler)

router.post('/getPositions', getPositionsHandler)

export default router;