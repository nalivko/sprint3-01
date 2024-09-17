import { Request, Response } from "express"
import { securityQueryRepository } from "../repositories/securityQueryRepository"

export const getDevicesController = async (req: Request, res: Response) => {    
    const userId = req.user.userId
    const activeSessions = await securityQueryRepository.getActiveDevices(userId)

    res.send(activeSessions)
}