import { Request, Response } from "express"
import { authService } from "../services/authService"
import { loginInputType, loginSuccessType } from "../types/authTypes"
import { jwtService } from "../../../application/jwtService"

export const loginController = async (req: Request<{}, {}, loginInputType>, res: Response<loginSuccessType>) => {
    const accessToken = await authService.login(req.body.loginOrEmail, req.body.password)

    if (!accessToken) {
        res.sendStatus(401)
        return
    }
    const userId = jwtService.getUserIdByToken(accessToken)

    const refreshToken = await authService.generateRefreshToken(userId!)

    res
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        .status(200)
        .send({ accessToken })
    return
}