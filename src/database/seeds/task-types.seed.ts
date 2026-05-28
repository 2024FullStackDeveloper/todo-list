import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { TaskTypes } from "modules/task/models/task-types.entity";

export class TaskTypesSeed implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource): Promise<any> {
        const taskTypesRepository = dataSource.getRepository(TaskTypes);
        if (await taskTypesRepository.count() > 0) return;

        try {
            await taskTypesRepository.insert([
                { name: 'Personal', freeze: true },
                { name: 'Work', freeze: true },
                { name: 'Education', freeze: true },
            ]);
        } catch {
            console.error(`Error occurred while seeding task types.`);
        } finally {
            console.log(`Task types seeded successfully.`);
        }
    }
}