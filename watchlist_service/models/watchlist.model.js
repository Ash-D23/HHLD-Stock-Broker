import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    name: {
        type: String
    },
    instrumentKey: {
        type: String
    }
})

const watchlistSchema = mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   stocks: [stockSchema],
   user_id: {
        type: String,
        required: true
   }
})

const watchlist = mongoose.model('watchlist', watchlistSchema);
export default watchlist;