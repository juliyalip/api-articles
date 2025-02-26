import { Response, NextFunction } from "express";
import { CustomRequest } from "../middelwares/authentificate";


export const wrapperComponent = (controller: (req: CustomRequest, res: Response, next: NextFunction) => void) => {
    const makeWrap = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next)
        } catch (error) {
            next(error)
        }
    }; return makeWrap
}