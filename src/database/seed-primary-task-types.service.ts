import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskTypes } from "modules/task/models/task-types.entity";
import { User } from "modules/users/models/user.entity";
import { Repository } from "typeorm";
import staticTaskTypes from './static/task-types.static.json';

@Injectable()
export class SeedPrimaryTaskTypesService {
    constructor(@InjectRepository(TaskTypes) private readonly taskTypeRepository: Repository<TaskTypes>,
        @InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async addPrimaryTaskTypesToUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) { return; }

        const staticTaskTypesList = staticTaskTypes.map(item => ({
            name: item,
            freeze: true,
            user: user
        }));

        await this.taskTypeRepository.save(staticTaskTypesList);
    }
}