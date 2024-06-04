import watchlistModel from "../models/watchlist.model.js";

export const getWatchLists = async (req, res) => {
   try {
       const { user_id } = req.body;
       const allWatchlists = await watchlistModel.find({ user_id: user_id});
       return res.status(200).json(allWatchlists);
   } catch (error) {
       return res.status(500).json({ error: 'Server error' });
   }
}

export const addStockToWatchList = async (req, res) => {
   try {
       const { watchlist, stock, user_id } = req.body;
       if (!watchlist) {
           return res.status(400).json({ error: 'Watchlist name is required' });
       } else if (!stock) {
           return res.status(400).json({ error: 'Stock is required' });
       } else {
           const existingWatchlist = await watchlistModel.findOne({ 'title': watchlist, 'user_id': user_id });
           if (!existingWatchlist) {
               return res.status(404).json({ error: 'Watchlist not found' });
           } else {
               existingWatchlist.stocks.push(stock);
               const updatedWatchlist = await existingWatchlist.save();
               res.status(200).json(updatedWatchlist);
           }
       }
   } catch (error) {
       return res.status(500).json({ error: 'Server error' });
   }
}

const addWatchList = async (req, res) => {
   try {
       const { title, user_id } = req.body;

       if (!title || !user_id) {
           return res.status(400).json({ error: 'Title and user ID is required for the watchlist' });
       } else {
            const existingWatchlist = await watchlistModel.findOne({ 'title': title, 'user_id': user_id });
            if(existingWatchlist){
                return res.status(404).json({ error: 'Watchlist already exists' });
            }
           const newWatchlist = {
               title: title,
               stocks: [],
               user_id: user_id
           };
           const updatedWatchlist = await watchlistModel.create(newWatchlist);
           return res.status(200).json(updatedWatchlist);
       }
   } catch (error) {
       return res.status(500).json({ error: 'Server error' });
   }
}

export const deleteStockFromWatchList = async (req, res) => {
    try {
        const { watchlist, stock, user_id } = req.body;
        if (!watchlist) {
            return res.status(400).json({ error: 'Watchlist name is required' });
        } else if (!stock) {
            return res.status(400).json({ error: 'Stock is required' });
        } else {
            const existingWatchlist = await watchlistModel.findOne({ 'title': watchlist, 'user_id': user_id });
            if (!existingWatchlist) {
                return res.status(404).json({ error: 'Watchlist not found' });
            } else {
                existingWatchlist.stocks = existingWatchlist.stocks.filter(data => data.name !== stock.name);
                const updatedWatchlist = await existingWatchlist.save();
                res.status(200).json({ message: "Deleted succesfully", watchlist: updatedWatchlist});
            }
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
 }

export default addWatchList;
