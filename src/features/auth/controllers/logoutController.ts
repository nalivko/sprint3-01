import { Request, Response } from "express";
import { jwtService } from "../../../application/jwtService";
import { securityRepository } from "../../security/repositories/securityRepository";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(401).send()
        return
    }
    if (!jwtService.verifyRefreshToken(refreshToken)) {
        res.status(401).send()
        return
    }
    const deviceId = req.cookies.deviceId
    await securityRepository.deleteDeviceById(deviceId)

    res.clearCookie('refreshToken').status(204).send();
    return
}