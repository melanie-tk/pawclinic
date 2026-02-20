import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { sendBadgeAssignedEmail } from "../services/mailer.js";
import { disconnect } from "node:cluster";
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
            error: req.query.error || undefined,
            title: "Dashboard",
            raisonSociale: req.company.raisonSociale,
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
                companyId: req.company.id
            }
        })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);

        //Erreur quand un badge est déjà existant, et qu'on souhaite créer le badge avec le même NFC
        if (error.code === 'P2002') {
            return res.redirect("/dashboard?error=Ce code NFC existe déjà")
        }
        return res.redirect("/dashboard?error=Erreur lors de la création du badge")
    }
}

export async function deleteaccessBadge(req, res) {
    try {
        await prisma.accessBadge.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);
        res.render("pages/badge.twig", {
            error: "Erreur lors de la suppression d'un badge"
        })
    }
}

export async function updateAccessBadge(req, res) {
    try {
        //récupération de l'id du badge depuis l'URL 
        const badgeId = parseInt(req.params.id)


        const { nfc, userId } = req.body
        const newUserId = userId ? parseInt(userId) : null // ? = sinon

        // On récupère l'ancien userId du badge 
        const before = await prisma.accessBadge.findUnique({
            where: { id: badgeId },
            select: { userId: true } // On récupère que l'Id
        })

        // On met à jour le badge*
        const badge = await prisma.accessBadge.update({
            // Quel badge modifier
            where: { id: badgeId },
            //Nouvelles données
            data: {
                nfc,
                user: newUserId
                    ? { connect: { id: newUserId } }  // Si employé choisi, assigne l'utilisateur
                    : { disconnect: true }                    // Sinon, désassigne si "-- Aucun --", enlève la relation entre le badge et l'utilisateur
            },
            include: { user: true } // on récupère aussi l'employé lié (pour avoir l'email
        })

        //Envoi du mail si on assigne le badge uniquement
        if (!before.userId && newUserId && badge.user?.email) {
            //Envoi du mail avec les infos de l'employé + code NFC
            await sendBadgeAssignedEmail(badge.user, badge.nfc)
        }

        res.redirect("/dashboard")

    } catch (error) {
        console.log(error);
        res.render("pages/badge.twig", {
            error: "Erreur lors de la modification d'un badge"
        })
    }
}