import express from 'express';
import { Client } from "@opensearch-project/opensearch";
import serverless from 'serverless-http';
const app = express();
//const port = 8083;

// Route for handling search requests
app.get('/search', async (req, res) => {
try {
  const searchTerm = req.query.q || '';


  var host_aiven = process.env.OpenSearchHost;
   var client = new Client({
      node: host_aiven
  });

  const { body } = await client.search({
    index: 'all_stocks', // Index name in OpenSearch
    body: {
     "query": {
       "match": {
         "name": {
           "query": searchTerm,
           "fuzziness": "AUTO"
         }
       }
     }
   }
  
  });

  // Process search results
  const hits = body.hits.hits;

  res.status(200).json(hits);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
}
});

app.get('/', async (req, res) => {
   res.json({message: "Lambda Search Service"});
});

// Wrap the Express app with serverless-http
const wrappedApp = serverless(app);

// // Export the wrapped app for Serverless Framework
export const handler = wrappedApp;

// app.listen(port, () => {
//     console.log(`Server is listening at http://localhost:${port}`);
//  })

