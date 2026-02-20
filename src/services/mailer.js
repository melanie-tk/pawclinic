import nodemailer from "nodemailer"

let transporter

export async function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.verify()
        console.log("Gmail OK")
    }
    return transporter
}

export async function sendBadgeAssignedEmail(user, badgeNfc) {
    if (!user?.email) {
        console.log("Impossible d'envoyer le mail : email manquant")
        return
    }

    try {
        const transport = await getTransporter()

        const info = await transport.sendMail({
            from: `"PawClinic" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Votre badge d'accès vous a été assigné",

            html: `<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background:#f4faf9; font-family: 'DM Sans', Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf9; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(26,92,82,0.10);">

                            <!-- Header -->
                            <tr>
                                <td style="background:#1a5c52; padding: 32px 40px; text-align:center;">
                                    <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px;">🐾 PawClinic</h1>
                                    <p style="margin:6px 0 0; color:rgba(255,255,255,0.65); font-size:13px;">Système de gestion des badges</p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding: 40px 40px 32px;">
                                    <p style="margin:0 0 8px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#8aaba7;">Nouveau badge assigné</p>
                                    <h2 style="margin:0 0 20px; font-size:22px; font-weight:700; color:#0f2926;">Bonjour ${user.firstName} ${user.lastName} 👋</h2>
                                    <p style="margin:0 0 28px; font-size:15px; color:#4a6b67; line-height:1.7;">
                                        Un badge d'accès vient de vous être assigné par votre responsable. Veuillez vous présenter à l'accueil pour le récupérer.
                                    </p>

                                    <!-- Badge info -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef8f6; border-radius:12px; margin-bottom:28px;">
                                        <tr>
                                            <td style="padding:20px 24px;">
                                                <p style="margin:0 0 4px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#8aaba7;">Code NFC de votre badge</p>
                                                <p style="margin:0; font-size:28px; font-weight:700; color:#1a5c52; letter-spacing:0.04em;">${badgeNfc}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Infos employé -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #c8ebe6; border-radius:12px; margin-bottom:32px;">
                                        <tr>
                                            <td style="padding:16px 24px; border-bottom:1px solid #c8ebe6;">
                                                <p style="margin:0; font-size:12px; color:#8aaba7; font-weight:600; text-transform:uppercase; letter-spacing:0.06em;">Nom</p>
                                                <p style="margin:4px 0 0; font-size:14px; color:#0f2926; font-weight:600;">${user.lastName} ${user.firstName}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:16px 24px;">
                                                <p style="margin:0; font-size:12px; color:#8aaba7; font-weight:600; text-transform:uppercase; letter-spacing:0.06em;">Email</p>
                                                <p style="margin:4px 0 0; font-size:14px; color:#0f2926; font-weight:600;">${user.email}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:0; font-size:13px; color:#8aaba7; line-height:1.6;">
                                        Si vous pensez avoir reçu ce message par erreur, veuillez contacter votre responsable.
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f4faf9; padding:20px 40px; text-align:center; border-top:1px solid #c8ebe6;">
                                    <p style="margin:0; font-size:12px; color:#8aaba7;">© 2026 PawClinic · Tous droits réservés</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>

        </body>
        </html>`
        })

        console.log("Mail envoyé")

    } catch (error) {
        console.error("Erreur envoi email :", error)
    }
}