import express from "express"
import { createTransaction, getUserTransactions, getAllTransactions } from "../controllers/transaction.js"

const router = express.Router()

router.post("/", createTransaction)

router.get("/:userId", getUserTransactions)

router.get("/", getAllTransactions)

export default router