import { HttpStatus } from '@nestjs/common';
import { Result } from '../interfaces/result.interface';
import { ResultStatus } from 'common/enums/result.enum';
import { Validation } from 'common/interfaces/validation.interface';

export class ResultService {
    static success<T>(value: T, message: string = 'messages.common.success'): Result<T> {
        return {
            isSuccess: true,
            statusCode: HttpStatus.OK,
            status: ResultStatus.Success,
            value,
            message,
        };
    }

    static error<T>(
        message: string = 'messages.common.error',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.BAD_REQUEST,
            status: ResultStatus.Error,
            message,
            content,
        };
    }


    static invalid<T>(
        message: string = 'messages.common.invalid',
        validations: Validation[],
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.BAD_REQUEST,
            status: ResultStatus.Invalid,
            message,
            validations,
            content,
        };
    }

    static notFound<T>(
        message: string = 'messages.common.notFound',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.NOT_FOUND,
            status: ResultStatus.NotFound,
            message,
            content,
        };
    }

    static unauthorized<T>(
        message: string = 'messages.common.unauthorized',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.UNAUTHORIZED,
            status: ResultStatus.Unauthorized,
            message,
            content,
        };
    }

    static forbidden<T>(
        message: string = 'messages.common.forbidden',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.FORBIDDEN,
            status: ResultStatus.Forbidden,
            message,
            content,
        };
    }

    static badRequest<T>(
        message: string = 'messages.common.badRequest',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.BAD_REQUEST,
            status: ResultStatus.BadRequest,
            message,
            content,
        };
    }

    static conflict<T>(
        message: string = 'messages.common.conflict',
        content?: string,
    ): Result<T> {
        return {
            isSuccess: false,
            statusCode: HttpStatus.CONFLICT,
            status: ResultStatus.Conflict,
            message,
            content,
        };
    }

    static noContent<T>(message: string = 'messages.common.noContent'): Result<T> {
        return {
            isSuccess: true,
            statusCode: HttpStatus.NO_CONTENT,
            status: ResultStatus.NoContent,
            message,
        };
    }

    static created<T>(value: T, message: string = 'messages.common.created'): Result<T> {
        return {
            isSuccess: true,
            statusCode: HttpStatus.CREATED,
            status: ResultStatus.Created,
            value,
            message,
        };
    }

    static updated<T>(value: T, message: string = 'messages.common.updated'): Result<T> {
        return {
            isSuccess: true,
            statusCode: HttpStatus.OK,
            status: ResultStatus.Updated,
            value,
            message,
        };
    }

    static deleted<T>(value: T, message: string = 'messages.common.deleted'): Result<T> {
        return {
            isSuccess: true,
            statusCode: HttpStatus.OK,
            status: ResultStatus.Deleted,
            value,
            message,
        };
    }
}
