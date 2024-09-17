import { Request, Response } from "express"
import { authService } from "../services/authService";
import { securityRepository } from "../../security/repositories/securityRepository";
import { jwtService } from "../../../application/jwtService";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(401).send()
        return
    }
    if(jwtService.verifyRefreshToken(refreshToken)) {
        res.status(401).send()
        return
    }
    const deviceId = req.cookies.deviceId
    await securityRepository.deleteDeviceById(deviceId)

    

    // await authService.addToExpiredTokens(req.cookies.refreshToken)

    res.clearCookie('refreshToken').status(204).send();
    return
}