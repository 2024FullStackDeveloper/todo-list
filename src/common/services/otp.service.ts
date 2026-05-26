import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);

    generate(length: number = 5): string {
        this.logger.log(`Generating OTP of length ${length}`);
        return Array.from({ length: length }).map((_) => (Math.floor(Math.random() * 9))).join('');
    }
}