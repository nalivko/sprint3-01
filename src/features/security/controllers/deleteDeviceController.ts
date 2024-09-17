import { Request, Response } from "express"
import { securityRepository } from "../repositories/securityRepository";

export const deleteDeviceController = async (req: Request<{id: string}>, res: Response) => {
    const isDeleted = await securityRepository.deleteDeviceById(req.params.id)

    if(isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }   
}