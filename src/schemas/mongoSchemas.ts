import mongoose from "mongoose"

export const tableSchema = new mongoose.Schema({
    matchID: {
        type: String,
        required: true
    },
    table: {
        type: [String],
        required: true
    }
})
export const table = mongoose.model("tables", tableSchema)
