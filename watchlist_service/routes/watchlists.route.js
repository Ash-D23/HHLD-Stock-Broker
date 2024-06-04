import express from "express";
import addWatchList, {getWatchLists, addStockToWatchList, deleteStockFromWatchList} from "../controllers/watchlists.controller.js"

const router = express.Router();

router.post('/add', addWatchList);
router.post('/addStock', addStockToWatchList);
router.post('/get', getWatchLists);
router.post('/deleteStock', deleteStockFromWatchList)

export default router;