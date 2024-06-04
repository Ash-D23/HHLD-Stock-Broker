import express from "express"
import { cancelOrder, getOrders, placeOrder } from "../controllers/orders.controller.js";

const router = express.Router();

router.post('/get', getOrders);
router.post('/add', placeOrder);
router.delete('/cancel', cancelOrder)

export default router;