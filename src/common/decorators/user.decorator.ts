import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator<string, ExecutionContext>((data, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request = context.getRequest() as Request;
    const userData = request?.['user'];
    return !data ? userData : userData?.[data];
})