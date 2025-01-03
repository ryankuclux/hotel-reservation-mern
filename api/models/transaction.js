import mongoose from "mongoose"

const TransactionSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        dates: {
            type: [Date],
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
)

export default mongoose.model("Transaction", TransactionSchema)