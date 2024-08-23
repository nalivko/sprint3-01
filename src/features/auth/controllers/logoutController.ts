import { Request, Response } from "express"
import { authService } from "../services/authService";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).send()
    }
    const f = await authService.verifyRefreshToken(refreshToken)
    console.log('f', f);
    
    if(!await authService.verifyRefreshToken(refreshToken)) {
        console.log('dsdsdsdsd');
        
        return res.status(401).send()
    }
    
    await authService.addToExpiredTokens(req.cookies.refreshToken)

    res.clearCookie('refreshToken').status(204).send();
    return
}