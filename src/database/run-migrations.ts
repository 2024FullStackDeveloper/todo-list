import dataSource from './data-source';
import path from 'path';
import { Client } from 'pg';
import { UserSeed } from './seeds/user.seed';
// When running from compiled JS (node) but migrations are still .ts,
// register ts-node so TypeORM can require TS migration files.
if (process.env.NODE_ENV !== 'production') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('ts-node').register({ transpileOnly: true, project: path.join(process.cwd(), 'tsconfig.json') });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tsconfig-paths/register');
  } catch (err) {
    // ignore if ts-node is not available
  }
}
const ensureDatabaseExists = async () => {
       const dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'postgres', 
       };

       const client = new Client(dbConfig);

       try{
          await client.connect();
          const dbName = process.env.DB_NAME;
          const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
          if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
          }
          console.log(`Database "${dbName}" is ready.`);
       }catch{
         console.error(`Error occurred while initializing database.`);
       }finally{
        await client.end();
       }
    }


export async function runMigrations() {
  try {
    await ensureDatabaseExists();
    await dataSource.initialize();
    if(await dataSource.showMigrations()){
        console.log(`Running pending migrations...`);
        await dataSource.runMigrations({
            transaction: 'all',
        });
        console.log(`Migrations applied successfully.`);
    }

    console.log('Migrations ran successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    if (dataSource && (dataSource as any).isInitialized) {
      await dataSource.destroy();
    }
  }
}

