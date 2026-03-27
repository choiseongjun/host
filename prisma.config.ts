import "dotenv/config";
import { defineConfig } from "prisma/config";

// @ts-ignore
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL!,
  },
});
