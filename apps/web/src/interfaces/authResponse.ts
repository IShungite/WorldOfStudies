export interface AuthResponse {
    type: string,
    name: string,
    token: string,
    abilities: string[],
    lastUsedAt: string,
    expiresAt: string
}