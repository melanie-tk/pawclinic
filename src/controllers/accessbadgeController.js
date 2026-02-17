import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
const prisma = new PrismaClient({ adapter });

export async function dashboard(req, res) {
    try {

        // Récupère tous les badges en base de données
        const accessbadges = await prisma.accessBadge.findMany({
            where: { companyId: req.company.id },
            include: { user: true }
        })

        const users = await prisma.user.findMany({
            where: { companyId: req.company.id },
            include: { badge: true }
        })

        const availableUsers = await prisma.user.findMany({
            where: {
                companyId: req.company.id,
                badge: { is: null } // Seulement les users sans badge
            }
        })

        const badgesAssociesCount = await prisma.accessBadge.count({
            where: {
                companyId: req.company.id,
                userId: { not: null }
            }
        });

        // Affiche la page d'accueil en lui envoyant la liste des badges
        res.render("pages/dashboard.twig", {
            accessbadges,
            users,
            availableUsers,
            badgesAssociesCount,
        }) // Pour le select d'assignation des badges

    } catch (error) {
        // Affiche l'erreur dans la console
        console.log(error);
        // Affiche la page avec l'erreur
        res.render("pages/dashboard.twig", {
            error: "Erreur lors de la récupération des badges"
        })
    }
}

export async function home(req, res) {
    res.redirect("/dashboard")
}

export async function addaccessBadge(req, res) {
    try {
        const { nfc } = req.body
        await prisma.accessBadge.create({
            data: {
                nfc,
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/badge.twig", {
            error: "Erreur lors de la création d'un badge"
        })
    }
}

export async function deleteaccessBadge(req, res) {
    try {
        await prisma.accessBadge.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/badge.twig", {
            error: "Erreur lors de la suppression d'un badge"
        })
    }
}


export async function updateAccessBadge(req, res) {
    try {
        const { nfc, userId } = req.body
        await prisma.accessBadge.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                nfc,
                userId: userId ? parseInt(userId) : null, //userId venant d'un formulaire HTML sera une string. Il faut gérer le cas où il est vide (badge non assigné)
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
        res.render("pages/badge.twig", {
            error: "Erreur lors de la modification d'un badge"
        })
    }
}