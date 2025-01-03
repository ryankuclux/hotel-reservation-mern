import Transaction from "../models/transaction.js"

export const createTransaction = async (req, res, next) => {
    const { userId, hotelId, roomId, dates, amount } = req.body

    const newTransaction = new Transaction({
    userId,
    hotelId,
    roomId,
    dates,
    amount
    })

    try {
    const savedTransaction = await newTransaction.save()

    res.status(200).json(savedTransaction);
    } catch (err) {
    next(err)
    }
}

export const getUserTransactions = async (req, res, next) => {
    try {
    const transactions = await Transaction.find({ userId: req.params.userId })
        .populate("hotelId", "name")
        .populate("roomId", "title")

    res.status(200).json(transactions)
    } catch (err) {
    next(err)
    }
}

export const getAllTransactions = async (req, res, next) => {
    try {
    const transactions = await Transaction.find().populate(
        "userId",
        "username"
    )

    res.status(200).json(transactions);
    } catch (err) {
    next(err)
    }
}