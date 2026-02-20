import express from "express"
import "dotenv/config"
import { companyRouter } from "./routes/companyRouter.js"
import { badgeRouter } from "./routes/badgeRouter.js"
import session from "express-session"
import { userRouter } from "./routes/userRouter.js"
import { authguard } from "./services/authguard.js"


const app = express() // On lance le serveur avec express
app.use(express.static("./public"))
app.use(session({
    //Secret à mettre dans le .env
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}
))

app.use(express.urlencoded({extended:true})) // Tous les champs sont visibles et à mettre avant les Router
app.use(companyRouter)
app.use("/badges", authguard, badgeRouter)
app.use("/users", authguard, userRouter)

app.listen(process.env.PORT, (error)=> {// Ouvrir l'application sur un port
    if(error) {
        console.log(error);
    }
    else {
        console.log(`Connecté sur le port ${process.env.PORT}`)
    }
}) 