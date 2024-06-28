import express from "express"
import LoadStockData, { getStockList } from "../controllers/stocks.controller.js"

const router = express.Router();

router.post('/loadData', LoadStockData);

router.get('/get', getStockList)

export default router;