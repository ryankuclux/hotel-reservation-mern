import express from "express"
import { createRoom, DeleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/room.js"
import { verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

// CREATE
router.post("/:hotelid", verifyAdmin, createRoom)

// UPDATE
router.put("/:id", verifyAdmin, updateRoom)
router.put("/availability/:id", updateRoomAvailability)

// DELETE
router.delete("/:id/", verifyAdmin, DeleteRoom)

// GET
router.get("/:id", getRoom)

// GET ALL
router.get("/", getRooms)

export default router