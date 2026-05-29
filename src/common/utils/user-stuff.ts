import { DoneBy } from "modules/task/interfaces/task-response.interface";
import { User } from "modules/users/models/user.entity";

export function handleDoneBy(user: User, userId: string, lang: string = 'ar'): DoneBy {
    if (user.id.trim() === userId.trim()) {
        return {
            id: user.id,
            name: lang == 'ar' ? 'انت' : 'You'
        }
    }

    return {
        id: user.id,
        name: user.firstName + ' ' + user.lastName
    }
}