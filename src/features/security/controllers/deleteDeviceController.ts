import { Request, Response } from "express"
import { securityRepository } from "../repositories/securityRepository";

export const deleteDeviceController = async (req: Request<{id: string}>, res: Response) => {
    const userId = req.user.userId
    const device = await securityRepository.getDeviceById(req.params.id)

    if (!device) {
        res.send(404)
        return
    }

    if(device.userId !== userId) {
        res.send(403)
        return
    }
    
    const isDeleted = await securityRepository.deleteDeviceById(req.params.id)

    if(isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }   
}