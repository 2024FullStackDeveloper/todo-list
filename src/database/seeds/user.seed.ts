import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { User } from "../../modules/users/models/user.entity";
import {config} from "dotenv";
import { BecryptService } from "../../common/services/becrypt.service";
config();



const adminHashPassword = new BecryptService().hash(process.env.ADMIN_PASSWORD ?? 'admin');

const adminUser : Partial<User> = {
firstName: process.env.ADMIN_FIRST_NAME ?? 'admin',
lastName: process.env.ADMIN_LAST_NAME ?? 'admin',
email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
hashedPassword: adminHashPassword ?? '',
};

export class UserSeed implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource): Promise<any> {
        const userRepository =  dataSource.getRepository(User);
        if(await userRepository.count() > 0)  return;
        
        try{
            await userRepository.insert([adminUser]);
        }catch{
            console.error(`Error occurred while seeding admin user.`);
        }finally{
            console.log(`Admin user seeded successfully.`);   
        }     
    }
}