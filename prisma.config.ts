import "dotenv/config"; // Important: This loads your .env file
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: env("DATABASE_URL"),
    },
    migrations: {
        seed: "ts-node prisma/seed.ts",
    },
});
