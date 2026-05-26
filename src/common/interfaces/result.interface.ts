import { HttpStatus } from "@nestjs/common";
import { ResultStatus } from "common/enums/result.enum";
import { Validation } from "./validation.interface";

export interface Result<T> {
    isSuccess: boolean;
    statusCode: HttpStatus;
    status: ResultStatus;
    value?: T | null;
    message: string;
    content?: string | null;
    validations?: Validation[] | null;
}


export type PromiseResult<T> = Promise<Result<T>>;