import { Request, Response } from "express"
import { authService } from "../services/authService";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).send()
    }
    
    // if(!await authService.verifyRefreshToken(refreshToken)) {
    //     return res.status(401).send()
    // }
    
    // await authService.addToExpiredTokens(req.cookies.refreshToken)

    res.clearCookie('refreshToken').status(204).send();
    return
}