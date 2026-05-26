import { CallHandler, ExecutionContext, Header, Injectable, NestInterceptor } from "@nestjs/common";
import { ResultStatus } from "common/enums/result.enum";
import { ApiResponse } from "common/interfaces/api-response.interface";
import { Result } from "common/interfaces/result.interface";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AppInterceptor<T> implements NestInterceptor<Result<T>, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const startTime = Date.now();

        const contextType = context.getType();
        if (contextType !== "http") return next.handle();

        const ctx = context.switchToHttp();
        const res = ctx.getResponse() as Response;
        const req = ctx.getRequest() as Request;
        const i18n = I18nContext.current(context);


        return next.handle().pipe(map((data: Result<T>) => {

            const headers = new Headers();
            headers.set('X-lang', i18n?.lang || '');
            headers.set('X-duration', (Date.now() - startTime).toString())
            res.setHeaders(headers);
            res.status(data?.statusCode);

            return {
                timestamp: Date.now() - startTime,
                statusCode: res.statusCode,
                status: data?.isSuccess ? "success" : "error",
                details: {
                    type: data?.status === ResultStatus.Invalid ? "field" : data?.content ? "modal" : "toast",
                    message: i18n?.t(data.message) || data?.message,
                    content: data?.content || undefined,
                    validations: data?.status === ResultStatus.Invalid ? data?.validations?.map(v => {
                        return {
                            ...v,
                            message: i18n?.t(v.message, {
                                args: {
                                    ...v,
                                }
                            }) || v.message,
                        }
                    }) || [] : undefined,
                },
                data: data?.value ?? null,
                path: req.url,
            };
        }));
    }
}