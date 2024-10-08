import { defineConfig } from "drizzle-kit";

process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
