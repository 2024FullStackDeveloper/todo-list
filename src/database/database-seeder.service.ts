import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DataSource } from "typeorm";
import { runSeeders } from 'typeorm-extension';
import { UserSeed } from "./seeds/user.seed";
import { TaskTypesSeed } from "./seeds/task-types.seed";
@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
    private readonly logger = new Logger(DatabaseSeederService.name);
    constructor(private readonly dataSource: DataSource) { }
    async onApplicationBootstrap() {
        this.logger.log(`Starting database seeding...`);
        try {
            const result = await runSeeders(this.dataSource, {
                seeds: [UserSeed, TaskTypesSeed],
            });
            if (result && result.length > 0) {
                this.logger.log(`Database seeding completed successfully.`);
            }
        } catch (error) {
            this.logger.error(`Error occurred while seeding database: ${error}`);
        }
    }
}