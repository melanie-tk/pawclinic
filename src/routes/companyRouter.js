import express from "express"
import { getLogin, getRegister, postLogin, postRegister, getRegisterSucceded, getForgotPassword, postForgotPassword, Logout } from "../controllers/companyController.js"
import { dashboard, home } from "../controllers/accessbadgeController.js"
import { authguard } from "../services/authguard.js"

export const companyRouter = express.Router()

companyRouter.get("/", authguard, home)
companyRouter.get("/dashboard", authguard, dashboard)
companyRouter.get("/register", getRegister)
companyRouter.post("/register", postRegister)
companyRouter.get("/registersucceded", getRegisterSucceded)
companyRouter.get("/forgotpassword", getForgotPassword)
companyRouter.post("/forgotpassword", postForgotPassword)
companyRouter.get("/login", getLogin)
companyRouter.post("/login", postLogin)
companyRouter.get("/logout", authguard, Logout)
