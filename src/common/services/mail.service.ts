import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SEND_OTP_CODE_EVENT, USER_REGISTERED_EVENT } from "common/constrants/events.constrant";
import { RegisterEvent } from "modules/auth/events/register-event";
import { SendOtpEvent } from "modules/auth/events/send-otp-event";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    constructor(private readonly mailerService: MailerService) { }

    @OnEvent(SEND_OTP_CODE_EVENT)
    async sendOtpCode(payload: SendOtpEvent): Promise<void> {
        try {
            this.logger.log(`Sending OTP code to ${payload.email}`);
            await this.mailerService.sendMail({
                to: payload.email,
                subject: 'Todo List - Reset Password',
                html: `
                <div style="font-family: sans-serif">
                    <h2>رمز التحقق (OTP)</h2>
                    <p>رمزك هو:</p>
                    <div style="font-size: 24px; font-weight: 700; letter-spacing: 4px">${payload.otp}</div>
                    <p>صلاحيته ${payload.otpExpireInMinutes} دقائق.</p>
                    <p style="color:#666">لو لم تطلبه، تجاهل الرسالة.</p>
                </div>
                `
            })
        } catch (error) {
            this.logger.error(`Failed to send OTP code to ${payload.email}`, error);
        }
    }

    @OnEvent(USER_REGISTERED_EVENT)
    async welcomeEmail(payload: RegisterEvent): Promise<void> {
        try {
            this.logger.log(`Sending welcome email to ${payload.email}`);
            await this.mailerService.sendMail({
                to: payload.email,
                subject: 'Todo List - Welcome',
                html: `
                <div style="font-family: sans-serif">
                    <h2>مرحباً بك في قائمة المهام</h2>
                    <p>شكراً لتسجيلك في قائمة المهام. يمكنك الآن إضافة المهام الخاصة بك.</p>
                    <p style="color:#666">لو لم تطلب إنشاء حساب، تجاهل الرسالة.</p>
                </div>
                `
            })
        } catch (error) {
            this.logger.error(`Failed to send welcome email to ${payload.email}`, error);
        }
    }
}