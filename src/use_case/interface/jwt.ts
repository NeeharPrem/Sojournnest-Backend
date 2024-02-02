interface JWT {
    generateAccessToken(userId: string, role: string): string;
    generateRefreshToken(userId: string): string;
}
export default JWT;