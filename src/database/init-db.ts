import { Client } from "pg";
import * as env from 'dotenv';
env.config();

export async function ensureDatabaseExists() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
    };

    const client = new Client(dbConfig);

    try {
        await client.connect();
        const dbName = process.env.DB_NAME;
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
        }
        console.log(`Database "${dbName}" is ready.`);
    } catch {
        console.error(`Error occurred while initializing database.`);
    } finally {
        await client.end();
    }
}

ensureDatabaseExists().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
