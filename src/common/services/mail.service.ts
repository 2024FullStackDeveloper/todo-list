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
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:36px 40px;text-align:center;">
                                            <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;letter-spacing:0.5px;">✅ قائمة المهام</h1>
                                            <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">إعادة تعيين كلمة المرور</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:40px;">
                                            <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e;font-weight:600;">رمز التحقق (OTP)</h2>
                                            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">استخدم الرمز التالي لإعادة تعيين كلمة المرور الخاصة بك:</p>
                                            <!-- OTP Box -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center" style="padding:24px 0;">
                                                        <div style="display:inline-block;background:linear-gradient(135deg,#f8f9ff 0%,#eef0fb 100%);border:2px dashed #667eea;border-radius:12px;padding:20px 48px;">
                                                            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#4a3f9f;font-family:'Courier New',monospace;">${payload.otp}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <!-- Expiry Notice -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;">
                                                <tr>
                                                    <td style="background:#fff8e1;border-radius:8px;padding:12px 16px;border-right:4px solid #ffb300;">
                                                        <p style="margin:0;font-size:13px;color:#7a6200;">⏱ صلاحية هذا الرمز <strong>${payload.otpExpireInMinutes} دقائق</strong> فقط</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding:0 40px 36px;">
                                            <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
                                            <p style="margin:0;font-size:12px;color:#999;line-height:1.7;text-align:center;">إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.<br>لا تشارك هذا الرمز مع أي شخص.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
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
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background:linear-gradient(135deg,#43e97b 0%,#38f9d7 100%);padding:44px 40px;text-align:center;">
                                            <div style="font-size:48px;margin-bottom:12px;">🎉</div>
                                            <h1 style="margin:0;font-size:26px;color:#1a1a2e;font-weight:700;">مرحباً بك!</h1>
                                            <p style="margin:8px 0 0;font-size:14px;color:rgba(0,0,0,0.55);">تم إنشاء حسابك بنجاح</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:40px;">
                                            <h2 style="margin:0 0 12px;font-size:20px;color:#1a1a2e;font-weight:600;">أهلاً بك في قائمة المهام ✅</h2>
                                            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.8;">شكراً لتسجيلك! يمكنك الآن البدء في تنظيم مهامك بسهولة وفعالية. إليك ما يمكنك فعله:</p>
                                            <!-- Features -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding:12px 16px;background:#f8f9ff;border-radius:10px;margin-bottom:8px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td style="padding-left:12px;vertical-align:middle;font-size:20px;">📝</td>
                                                                <td style="padding-right:4px;font-size:14px;color:#333;">إنشاء وإدارة المهام بسهولة</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td style="height:8px;"></td></tr>
                                                <tr>
                                                    <td style="padding:12px 16px;background:#f0fff4;border-radius:10px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td style="padding-left:12px;vertical-align:middle;font-size:20px;">🎯</td>
                                                                <td style="padding-right:4px;font-size:14px;color:#333;">تحديد الأولويات والمواعيد النهائية</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td style="height:8px;"></td></tr>
                                                <tr>
                                                    <td style="padding:12px 16px;background:#fff8e1;border-radius:10px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td style="padding-left:12px;vertical-align:middle;font-size:20px;">📊</td>
                                                                <td style="padding-right:4px;font-size:14px;color:#333;">تتبع تقدمك وإنجازاتك</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding:0 40px 36px;">
                                            <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
                                            <p style="margin:0;font-size:12px;color:#999;line-height:1.7;text-align:center;">إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذه الرسالة.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `
            })
        } catch (error) {
            this.logger.error(`Failed to send welcome email to ${payload.email}`, error);
        }
    }
}