import UpstoxClient from 'upstox-js-sdk'

export const getOrders = async (req, res) => {
    const { accessToken } = req.body
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = accessToken;
    let apiInstance = new UpstoxClient.OrderApi();
 
    let apiVersion = "2.0";
 
    apiInstance.getOrderBook(apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error });
        } else {
            return res.status(200).json({ message: data });
        }
    });
 }

export const placeOrder = async (req, res) => {
    const { instrumentKey, quantity, price, accessToken, order } = req.body

    // console.log(instrumentKey, quantity, price)
   let defaultClient = UpstoxClient.ApiClient.instance;
   var OAUTH2 = defaultClient.authentications['OAUTH2'];
   OAUTH2.accessToken = accessToken;

   let apiInstance = new UpstoxClient.OrderApi();
   let body = new UpstoxClient.PlaceOrderRequest(1, UpstoxClient.PlaceOrderRequest.ProductEnum.D, UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY, 0.0, instrumentKey, UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET, order === "Buy" ? UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.BUY : UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.SELL, quantity, price, false);
   let apiVersion = "2.0";

   apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
       if (error) {
           return res.status(500).json({ error: error });
       } else {
           return res.status(200).json({ message: data });
       }
   });
}

export const cancelOrder = async (req, res) => {
    const {  accessToken, order_Id } = req.body
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = accessToken;
    let apiInstance = new UpstoxClient.OrderApi();
 
    let orderId = order_Id;
    let apiVersion = "2.0";
 
    apiInstance.cancelOrder(orderId, apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: error });
        } else {
            return res.status(200).json({ message: data });
        }
    });
 }