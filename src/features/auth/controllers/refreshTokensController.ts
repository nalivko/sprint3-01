import { Request, Response } from "express"
import { authService } from "../services/authService"
import { jwtService } from "../../../application/jwtService"

export const refreshTokensController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).send()
    }

    const userId = await jwtService.verifyRefreshToken(refreshToken)
    if (!userId) {
        return res.status(401).send()
    }
    
    const accessToken = await authService.generateNewAccessToken(refreshToken, userId)

    if (!accessToken) {
        return res.status(401).send()
    }

    const newRefreshToken = await authService.generateRefreshToken(userId, refreshToken)
    
    res
        .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true })
        .status(200)
        .send({ accessToken })
    return
}