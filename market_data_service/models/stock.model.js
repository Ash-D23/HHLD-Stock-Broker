import mongoose from "mongoose";

const stockSchema = mongoose.Schema({
    name: {
        type: String
    },
    instrumentKey: {
        type: String
    },
    type: {
        type: String
    },
    exchange: {
        type: String
    }
})

const stock = mongoose.model('stock', stockSchema);
export default stock;