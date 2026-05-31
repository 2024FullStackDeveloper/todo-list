import dataSource from './data-source';
import path from 'path';
import { ensureDatabaseExists } from './init-db';
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


export async function runMigrations() {
  try {

    await dataSource.initialize();
    if (await dataSource.showMigrations()) {
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

