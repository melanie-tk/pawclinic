import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter })

export async function addUser(req, res) {
    try {
        const { firstName, lastName, email } = req.body
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                companyId: req.company.id // Lié automatiquement à la company connectée
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/home.twig", {
            error: "Erreur lors de la création de l'employé"
        })
    }
}

export async function updateUser(req, res) {
    try {
        const { firstName, lastName, email, password, age, gender } = req.body
        await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
                companyId: req.company.id // ✅ Sécurité
            },
            data: {
                firstName,
                lastName,
                email,
                password,
                age: age ? parseInt(age) : null,
                gender: gender || null,
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/home.twig", {
            error: "Erreur lors de la modification de l'employé"
        })
    }
}

export async function deleteUser(req, res) {
    try {
        await prisma.user.delete({
            where: {
                id: parseInt(req.params.id),
                companyId: req.company.id // ✅ Sécurité
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/home.twig", {
            error: "Erreur lors de la suppression de l'employé"
        })
    }
}