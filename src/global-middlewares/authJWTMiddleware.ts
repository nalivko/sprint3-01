import { NextFunction, Request, Response } from "express"
import { jwtService } from "../application/jwtService"
import { usersRepository } from "../features/users/usersRepository"

export const authJWTMiddleware = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = jwtService.getUserIdByToken(token)
    const user = await usersRepository.getUserById(userId!)

    if (!user) {
        res.send(401)
        return
    }

    req.user = {
        userId: userId!,
        login: user.login
    }

    next()
}