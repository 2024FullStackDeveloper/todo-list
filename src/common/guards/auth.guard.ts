import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly i18n: I18nService) { }

    canActivate(context: ExecutionContext): boolean {

        const ctx = context.switchToHttp();
        const request = ctx.getRequest() as Request;
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(this.i18n.t("errors.auth.unauthorized"));
        }

        try {
            const user = this.jwtService.verify(token);
            request['user'] = user;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException(this.i18n.t("errors.auth.sessionEnded"));
            }
            throw new UnauthorizedException(this.i18n.t("errors.auth.unauthorized"));
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }

}