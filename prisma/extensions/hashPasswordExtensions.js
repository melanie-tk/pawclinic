import { Prisma } from "../../src/generated/prisma/client.js"
import bcrypt from "bcrypt";

export const hashPasswordExtension = Prisma.defineExtension({ // Extension , tout copier coller
    name: "hashPassword",
    query: {
        company: {
            create: async ({ args, query }) => {
                const passwordHash = await bcrypt.hash(args.data.password, 10)
                delete args.data.password
                args.data.passwordHash = passwordHash
                return await query(args)
            }
        },
        user: {
            create: async ({ args, query }) => {
                try {
                    const hashedPassword = await bcrypt.hash(args.data.password, 10)
                    args.data.password = hashedPassword
                    return await query(args)
                }
                catch (error) {
                    throw error
                }

            }
        }
    }
})