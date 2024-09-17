import { Request, Response } from "express"
import { securityRepository } from "../repositories/securityRepository"

export const deleteAllDevicesController = async (req: Request, res: Response) => {
    const userId = req.user.userId
    const deviceId = req.cookies.deviceId

    await securityRepository.deleteAllDevices(userId, deviceId)

    res.send(204)
}