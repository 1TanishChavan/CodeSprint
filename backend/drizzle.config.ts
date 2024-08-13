import { defineConfig } from 'drizzle-kit';
import "dotenv/config";

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/models/schema.ts',
    out: '../database/migrations',
    dbCredentials: {
        url: process.env.DIRECT_URL
    },
    verbose: true,
    strict: true,
});
