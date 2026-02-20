import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "../../prisma/adapter.js";
import { hashPasswordExtension } from "../../prisma/extensions/hashPasswordExtensions.js";
const prisma = new PrismaClient({ adapter }).$extends(hashPasswordExtension);
import bcrypt from "bcrypt"

export function getRegister(req, res) {
    res.render("pages/register.twig", {
        title: "Inscription"
    })
}

export async function postRegister(req, res) {
    try {
        const { raisonSociale, siret, password, passwordConfirm, nomDirecteur } = req.body;
        await prisma.company.create({
            data: {
                raisonSociale,
                siret,
                password,
                nomDirecteur,
            }
        })
        res.redirect("/registersucceded")
    }
    catch (error) {
        console.log(error);
        res.render("pages/register.twig", {
            title: "Inscription",
            error: "Erreur lors de l'inscription..."
        })
    }
}

export function getRegisterSucceded(req, res) {
    res.render("pages/registersucceded.twig", {
        title: "Compte créé"
    })
}


export function getLogin(req, res) {
    res.render("pages/login.twig", {
        title: "Connexion"
    })
}

export async function postLogin(req, res) {
    try {
        // Récupérer l'utilisateur par son siret
        const company = await prisma.company.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        if (company) {
            // Vérifier la concordance des mots de passe
            if (await bcrypt.compare(req.body.password, company.passwordHash)) {
                // Garder en mémoire l'utilisateur
                req.session.company = company.id
                // Rediriger vers la page d'accueil si ok
                res.redirect("/")
            }
            else {
                throw new Error("Mot de passe invalide")
            }
        }
        else {
            throw new Error("Mail invalide")
        }
    } catch (error) {
        console.log(error);
        res.render("pages/login.twig", {
            error: "Identifiants invalides"
        })
    }
}

export function getForgotPassword(req, res) {
    res.render("pages/forgotpassword.twig", {
        title: "Mot de passe oublié"
    })
}

export async function postForgotPassword(req, res) {
    try {
        const { siret, password, passwordConfirm } = req.body

        if (password !== passwordConfirm) {
            return res.render("pages/forgotpassword.twig", {
                title: "Mot de passe oublié",
                error: "Les mots de passe ne correspondent pas"
            })
        }

        const company = await prisma.company.findUnique({
            where: { siret }
        })

        if (!company) {
            return res.render("pages/forgotpassword.twig", {
                title: "Mot de passe oublié",
                error: "Aucun compte trouvé avec ce SIRET"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.company.update({
            where: { siret },
            data: { passwordHash }
        })

        res.redirect("/login")

    } catch (error) {
        console.log(error)
        res.render("pages/forgotpassword.twig", {
            title: "Mot de passe oublié",
            error: "Une erreur est survenue"
        })
    }
}
export function Logout(req, res) {
    req.session.company = null;
    res.redirect("/")
}