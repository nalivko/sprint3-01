import { Request, Response } from "express"
import { authService } from "../services/authService"
import { loginInputType, loginSuccessType } from "../types/authTypes"
import { jwtService } from "../../../application/jwtService"
import { randomUUID } from "crypto"
import { authRepository } from "../repositories/auth-repo"

export const loginController = async (req: Request<{}, {}, loginInputType>, res: Response/*<loginSuccessType>*/) => {

    const accessToken = await authService.login(req.body.loginOrEmail, req.body.password)

    if (!accessToken) {
        res.sendStatus(401)
        return
    }
    const verifiedAccessToken = jwtService.verifyAccessToken(accessToken)

    const userId = verifiedAccessToken!.user.userId
    const deviceId = randomUUID()

    const refreshToken = await jwtService.createRefreshToken(userId, deviceId)
    const verifiedRefreshToken = jwtService.verifyRefreshToken(refreshToken)
    if (!verifiedRefreshToken) {
        res.sendStatus(401)
        return
    }

    const iat = new Date(verifiedRefreshToken.iat! * 1000).toISOString()
    const deviceName = req.headers["user-agent"] || 'default'
    const ip = req.ip!
    const exp = new Date(verifiedRefreshToken.exp! * 1000).toISOString()

    await authRepository.createUserSession({ userId, deviceId, iat, deviceName, ip, exp })

    res
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .cookie('deviceId', deviceId, { httpOnly: true, secure: true })
        .status(200)
        .send({ accessToken })
    return
}