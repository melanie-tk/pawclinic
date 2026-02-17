import express from "express"
import { authguard } from "../services/authguard.js"
import { addaccessBadge, deleteaccessBadge, updateAccessBadge } from "../controllers/accessbadgeController.js"

export const badgeRouter = express.Router()

badgeRouter.post("/add", authguard, addaccessBadge)
badgeRouter.post("/:id/update", authguard, updateAccessBadge)
badgeRouter.post("/:id/delete", authguard, deleteaccessBadge)