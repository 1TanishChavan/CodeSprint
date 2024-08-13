"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
require("dotenv/config");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
    schema: './src/models/schema.ts',
    out: '../database/migrations',
    dbCredentials: {
        url: process.env.DIRECT_URL
        // host: process.env.MYSQL_HOST,
        // port: process.env.MYSQL_PORT,
        // user: process.env.MYSQL_USER,
        // password: process.env.MYSQL_PASSWORD,
        // database: process.env.MYSQL_DATABASE,
    },
    verbose: true,
    strict: true,
});
