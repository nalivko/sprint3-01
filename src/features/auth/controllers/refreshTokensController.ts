import { Request, Response } from "express"
import { authService } from "../services/authService"
import { jwtService } from "../../../application/jwtService"
import { authRepository } from "../repositories/auth-repo"

export const refreshTokensController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const deviceId = req.cookies.deviceId

    if (!refreshToken || !deviceId) {
        return res.status(401).send()
    }

    const verifiedToken = jwtService.verifyRefreshToken(refreshToken)
    if (!verifiedToken) {
        return res.status(401).send()
    }
    
    const iat = verifiedToken!.iat
    if (!iat) {
        return res.status(401).send()
    }
    const isSessionExist = await authRepository.getUserSession(deviceId, new Date(iat * 1000).toISOString())
    if (!isSessionExist) {
        return res.status(401).send()
    }
    
    if (!verifiedToken?.userId) {
        return res.status(401).send()
    }
    const userId = verifiedToken.userId
    
    const newAccessToken = await jwtService.createAccessToken(userId)

    const newRefreshToken = await jwtService.createRefreshToken(userId, 'deviceId')
    const verifiedNewRefreshToken = jwtService.verifyRefreshToken(newRefreshToken)
    await authRepository.updateUserSession(deviceId, new Date(verifiedNewRefreshToken!.iat! * 1000).toISOString())
    
    res
        .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true })
        .status(200)
        .send({ newAccessToken })
    return
}