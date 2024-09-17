import { Request, Response } from "express"
import { authService } from "../services/authService";
import { securityRepository } from "../../security/repositories/securityRepository";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).send()
    }
    const deviceId = req.cookies.deviceId
    await securityRepository.deleteDeviceById(deviceId)
    
    // if(!await authService.verifyRefreshToken(refreshToken)) {
    //     return res.status(401).send()
    // }
    
    // await authService.addToExpiredTokens(req.cookies.refreshToken)

    res.clearCookie('refreshToken').status(204).send();
    return
}