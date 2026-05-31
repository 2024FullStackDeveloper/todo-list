import { Priority } from "../enums/priority.enum";


export interface DoneBy {
    id: string;
    name: string;
}


export interface TaskResponse {
    id: string;
    taskType: { id: string; name: string };
    title: string;
    description: string | null;
    priority: Priority;
    dueDate: Date | null;
    isCompleted: boolean;
    completedAt: Date | null;
    doneBy: DoneBy;
    createdAt: Date;
    updatedAt: Date;
}