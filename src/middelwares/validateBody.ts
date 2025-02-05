import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import HttpError from "../utils/HttpError";

export const validateBody = (schema: Schema) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await schema.validateAsync(req.body)
            if (!req.file) {
                return next(new HttpError(400, "Fill out all fields"))
            }
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
            if (!allowedTypes.includes(req.file.mimetype)) {
                return next(new HttpError(400, "Invalid file type"))
            }
            if (req.file.size > 5 * 1024 * 1024) {
                return next(new HttpError(400, "File too large (max 5MB)"));
            }
            next()
        } catch (error) {
            return next(new HttpError(400, "Fill out all fields"))
        }
    }
};
