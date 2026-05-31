export interface RefreshTokenResponse {
    refreshToken: string;
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}