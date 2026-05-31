export class SendOtpEvent {
    constructor(
        public readonly email: string,
        public readonly otp: string,
        public readonly otpExpireInMinutes: number
    ) { }
}