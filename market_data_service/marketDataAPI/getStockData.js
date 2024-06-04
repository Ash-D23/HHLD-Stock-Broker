import UpstoxClient from "upstox-js-sdk";

export const getMarketQuoteOHLC = (symbol, accessToken, callback) => {
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = accessToken;
    let apiInstance = new UpstoxClient.MarketQuoteApi();
    let apiVersion = "2.0";
    //let symbol = "NSE_EQ|INE040A01034";
    let interval = "1d";
    apiInstance.getMarketQuoteOHLC(
        symbol,
        interval,
        apiVersion,
        (error, data, response) => {
            if (error) {
                console.error(error);
                callback(error, null)
            } else {
                console.log(
                    "API called successfully. Returned data: " + JSON.stringify(data)
                );
                callback(null, data)
            }
        }
    );
 };

 export const getHoldings = (callback, accessToken) => {
    
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = accessToken;

    let apiInstance = new UpstoxClient.PortfolioApi();
    let apiVersion = "2.0";

    apiInstance.getHoldings(
        apiVersion,
        (error, data, response) => {
            if (error) {
                console.error(error);
                callback(error, null)
            } else {
                console.log("API called successfully. Returned data: " + JSON.stringify(data));
                callback(null, data)
            }
        }
    );
 }; 

 export const getPositions = (callback, accessToken) => {

    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = accessToken;
 
    let apiInstance = new UpstoxClient.PortfolioApi();

    let apiVersion = "2.0";
    apiInstance.getPositions(apiVersion, (error,data,response)=>{
        if (error) {
            console.error(error);
            callback(error, null)
        } else {
            console.log(
                "API called successfully. Returned data: " + JSON.stringify(data)
            );
            callback(null, data)
        }
    })
 }