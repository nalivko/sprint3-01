import jwt, { JwtPayload } from 'jsonwebtoken'
import { SETTINGS } from '../settings'

export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign(
            {
                user: {
                    // login: userLogin,
                    userId
                }
            },
            SETTINGS.AC_SECRET,
            {
                expiresIn: SETTINGS.AC_TIME
            }
        )
    },

    async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign(
            {userId},
            SETTINGS.REFRESH_SECRET,
            {
                expiresIn: SETTINGS.REFRESH_TIME
            }
        )
    },

    getUserIdByToken(token: string): string | null {
        try {
            const result = jwt.verify(token, SETTINGS.AC_SECRET) as JwtPayload

            return result.user.userId
        } catch (error) {
            return null
        }
    },

    async verifyRefreshToken(refreshToken: string) {
        try {
            const result = jwt.verify(refreshToken, SETTINGS.REFRESH_SECRET) as JwtPayload

            return result.userId
        } catch (error) {
            return null
        }
    }

}