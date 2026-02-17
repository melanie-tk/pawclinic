import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/", // on enlève dans schema prisma, mais dans tout le dossier prisma -> arborescence souhaitée dans dossier prisma
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env["DATABASE_URL"],
    },
});
