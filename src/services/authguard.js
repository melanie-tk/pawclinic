import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter })

export async function authguard(req, res, next){
    try {
        if(req.session.company){
            const company = await prisma.company.findUnique({
                select:{
                    id:true,
                    raisonSociale:true,
                    siret:true,
                },
                where:{
                    id: req.session.company
                }
            })
            if(company){
                req.company = company
                return next()
            }
            else{
                throw new Error("L'utilisateur a été supprimé de la base de données")
            }
        }
        else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
        res.redirect("/login")
    }
}