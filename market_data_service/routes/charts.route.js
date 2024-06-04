import express from "express"
import { getHistoricalDataHandler, getIntraDayCandleDataHandler } from "../controllers/candleCharts.controller.js";

const router = express.Router();

router.get('/getHistoricalData', getHistoricalDataHandler);

router.get('/getIntraDayData', getIntraDayCandleDataHandler)

export default router;

