import { Request, Response } from "express"
import { jwtService } from "../../../application/jwtService"
import { authRepository } from "../repositories/auth-repo"

export const refreshTokensController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const deviceId = req.cookies.deviceId

    if (!refreshToken || !deviceId) {
        res.status(401).send()
        return
    }

    const verifiedToken = jwtService.verifyRefreshToken(refreshToken)
    if (!verifiedToken) {
        res.status(401).send()
        return
    }
    
    const iat = verifiedToken!.iat
    if (!iat) {
        res.status(401).send()
        return
    }
    const isSessionExist = await authRepository.getUserSession(deviceId, new Date(iat * 1000).toISOString())
    if (!isSessionExist) {
        res.status(401).send()
        return
    }
    
    if (!verifiedToken.userId) {
        res.status(401).send()
        return
    }
    const userId = verifiedToken.userId
    
    const newAccessToken = await jwtService.createAccessToken(userId)

    const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId)
    const verifiedNewRefreshToken = jwtService.verifyRefreshToken(newRefreshToken)
    
    await authRepository.updateUserSession(deviceId, new Date(verifiedNewRefreshToken!.iat! * 1000).toISOString())
    
    res
        .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true })
        .status(200)
        .send({ newAccessToken })
    return
}