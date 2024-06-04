import UpstoxClient from "upstox-js-sdk";

export const getHistoricalData = (symbol, filter, callback) => {
    let apiInstance = new UpstoxClient.HistoryApi();
    
    let apiVersion = "2.0"; 
    let interval = "30minute"; 
    let toDate = new Date();
    toDate = toDate.toISOString().split('T')[0]

    let fromDate;

    if(filter === "1M"){
        let date = new Date()
        let newMonth = date.getMonth() - 1
        let flag = false
        if(newMonth<0){
            newMonth = 12 + newMonth
            flag = true
        }

        fromDate = new Date()
        fromDate.setMonth(newMonth)

        if(flag){
            fromDate.setFullYear(fromDate.getFullYear() - 1)
        }

        interval = "day"
        
    }else if(filter === "6M"){
        let date = new Date()
        let newMonth = date.getMonth() - 6
        let flag = false
        if(newMonth<0){
            newMonth = 12 + newMonth
            flag = true
        }

        fromDate = new Date()
        fromDate.setMonth(newMonth)

        if(flag){
            fromDate.setFullYear(fromDate.getFullYear() - 1)
        }

        interval = "day"
    }else{
        fromDate = new Date()
        fromDate.setFullYear(fromDate.getFullYear() - 1)
        interval = "day"
    }
    
    fromDate = fromDate.toISOString().split('T')[0]

    apiInstance.getHistoricalCandleData1(symbol, interval, toDate, fromDate,apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            callback(error, null)
        } else {
            console.log(
                "API called successfully. Returned data: "
            );
            callback(null, data)
        }
    });
    
 }

 export const getIntraDayData = (symbol, callback) => {
    let apiInstance = new UpstoxClient.HistoryApi();

    let apiVersion = "2.0"; 
    let instrumentKey = symbol; 
    let interval = "1minute"; 

    apiInstance.getIntraDayCandleData(instrumentKey, interval, apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            callback(error, null)
        } else {
            console.log(
                "API called successfully. Returned data: "
            );
            callback(null, data)
        }
    });
 }