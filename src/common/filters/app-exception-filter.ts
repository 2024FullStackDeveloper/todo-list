import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Validation } from "common/interfaces/validation.interface";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import { ZodValidationException } from "nestjs-zod";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppExceptionFilter.name);
    catch(exception: HttpException | ZodValidationException | Error, host: ArgumentsHost) {

        if (host.getType() !== "http") return;

        const isProduction = process.env.NODE_ENV === "production";
        const startTime = Date.now();

        const ctx = host.switchToHttp();
        const response = ctx.getResponse() as Response;
        const request = ctx.getRequest() as Request;

        const statusCode = exception instanceof ZodValidationException ? HttpStatus.BAD_REQUEST : exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const i18n = I18nContext.current(host);
        let message = (statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? i18n?.t('errors.internalServerError') : isProduction ? i18n?.t('errors.somethingWentWrong') : exception?.message);

        let apiResponse: any = {
            timestamp: 0,
            status: "error",
            statusCode,
            details: {
                type: "toast",
                message
            },
            data: null,
            path: request.url,
        }

        if (exception instanceof ZodValidationException) {
            const zodErrors = exception.getZodError() as any;

            const validations: Validation[] = []
            const errors = JSON.parse(zodErrors);
            errors.forEach((err: any) => {
                validations.push({
                    field: err?.path?.[0] || '',
                    message: i18n?.t(err?.message, {
                        args: {
                            field: err?.path?.join('.') || 'unknown',
                            ...err.params,
                            ...err,
                        }
                    }) || '',
                })
            });

            apiResponse.details = {
                type: "field",
                message,
                validations,
            }
        } else if (exception instanceof HttpException) {
            apiResponse.details = {
                type: "modal",
                message,
                content: !isProduction ? exception.stack : ""
            }
        }
        else if (exception instanceof Error) {
            apiResponse.details = {
                type: "toast",
                message
            }
        }

        apiResponse.timestamp = Date.now() - startTime;

        response.status(statusCode).header({
            'X-lang': i18n?.lang || 'en',
            'X-duration': `${apiResponse.timestamp}ms`,
        }).json(apiResponse);
    }
}