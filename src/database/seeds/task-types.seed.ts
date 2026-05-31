import { DataSource, ILike } from "typeorm";
import { Seeder } from "typeorm-extension";
import { TaskTypes } from "modules/task/models/task-types.entity";
import * as env from "dotenv";
import { User } from "modules/users/models/user.entity";
env.config();

export class TaskTypesSeed implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource): Promise<any> {
        const taskTypesRepository = dataSource.getRepository(TaskTypes);
        const userRepository = dataSource.getRepository(User);
        const adminUser = await userRepository.findOne({ where: { email: ILike(`${process.env.ADMIN_EMAIL}`) } });
        if (!adminUser) return;


        if (await taskTypesRepository.count({ where: { user: { id: adminUser.id } } }) > 0) return;

        try {
            await taskTypesRepository.insert([
                { name: 'Personal', freeze: true, user: adminUser },
                { name: 'Work', freeze: true, user: adminUser },
                { name: 'Education', freeze: true, user: adminUser },
            ]);
        } catch {
            console.error(`Error occurred while seeding task types.`);
        } finally {
            console.log(`Task types seeded successfully.`);
        }
    }
}