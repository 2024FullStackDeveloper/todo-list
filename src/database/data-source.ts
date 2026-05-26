import { DataSource, DataSourceOptions } from "typeorm";
import {config} from "dotenv";
import path from "path";
import { User } from "../modules/users/models/user.entity";
import { Task } from "../modules/task/models/task.entity";
config();


const isProduction = process.env.NODE_ENV === 'production';
const srcDir = path.join(process.cwd(), isProduction ? 'dist' : 'src');

const options : DataSourceOptions  = {
  type: process.env.DB_TYPE as any || 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize:  !isProduction,
  logging: !isProduction,
  entities: [srcDir + '/modules/**/models/*.{js,ts}'],
  migrations: [srcDir + '/database/migrations/*.{js,ts}'],
}

export default new DataSource(options);
