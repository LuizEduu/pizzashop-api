import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
