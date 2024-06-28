import fs from 'fs';
import { parse } from 'csv-parse';
// import { PrismaClient } from '@prisma/client';
import { Client } from "@opensearch-project/opensearch";
import stock from '../models/stock.model.js';

const LoadStockData = async (req, res) => {
//  const prisma = new PrismaClient();
 const csvFilePath = '/Users/ashut/Desktop/Project/Relearn/HHLD/HHLD-Stock-Broker/market_data_service/mini2.csv';
 const stocksDataForOpenSearch = [];
  let count = 5
 fs.createReadStream(csvFilePath)
   .pipe(parse({ delimiter: ',', quote: '"', columns: true }))
   .on('data', async (row) => {
     try {
    //    await prisma.Stocks.create({
    //      data: {
    //        instrumentKey: row["instrument_key"],
    //        //exchangeToken: row['"exchange_token"'],
    //        //tradingSymbol: row['"tradingsymbol"'],
    //        name: row["name"],
    //        //lastPrice: parseFloat(row['"last_price"']),
    //        //expiry: row['"expiry"'] ? new Date(row['"expiry"']) : null,
    //        //strike: row['"strike"'] ? parseFloat(row['"strike"']) : null,
    //        //tickSize: parseFloat(row['"tick_size"']),
    //        //lotSize: parseInt(row['"lot_size"']),
    //        type: row["instrument_type"],
    //        //optionType: row['"option_type"'] || null,
    //        exchange: row["exchange"]
    //      }
    //    });
    //    console.log(`Inserted row: ${JSON.stringify(row)}`);
      //  console.log('Adding to OpenSearch');

      //  //sending data to opensearch
      //  var host = process.env.OpenSearchHost;
      //  var client = new Client({
      //    node: host
      //  });

      //  var index_name = "mini_stocks";
       var stock_data = {
         instrumentKey: row["instrument_key"],
         name: row["name"],
         type: row["instrument_type"],
         exchange: row["exchange"]
       };

       // Add to MongoDB
       console.log(stock_data)
       const res = await stock.create(stock_data);
       console.log(res)

     } catch (error) {
       console.error(`Error inserting row: ${JSON.stringify(row)}, Error: ${error}`);
     }
   })
   .on('end', async () => {
     console.log('CSV file successfully processed.');
    //  await prisma.$disconnect();
   })
   .on('error', (error) => {
     console.error('Error parsing CSV:', error);
   });
}

export const getStockList = async (req, res) => {

  const searchTerm = req.query.q

  try {
      const allStocks = await stock.find();

      const result = allStocks.filter((data) => data?.name.toLowerCase().includes(searchTerm.toLowerCase()))

      return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ error: 'Server error' });
  }
}

export default LoadStockData;