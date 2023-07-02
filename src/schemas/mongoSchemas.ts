import mongoose from "mongoose"

export const tableSchema = new mongoose.Schema({
    matchID: {
        type: String,
        required: true
    },
    table: {
        type: [[String]],
        required: true
    },
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    turn: {
        type: String,
        required: true
    },
})
export const Table = mongoose.model("tables", tableSchema)
