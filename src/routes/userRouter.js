import express from "express"
import { authguard } from "../services/authguard.js"
import { addUser, deleteUser, updateUser } from "../controllers/userController.js"

export const userRouter = express.Router()

userRouter.post("/add", authguard, addUser)
userRouter.post("/:id/update", authguard, updateUser)
userRouter.post("/:id/delete", authguard, deleteUser)