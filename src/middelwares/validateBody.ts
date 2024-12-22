import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import HttpError from "../utils/HttpError";

export const validateBody = (schema: Schema) => {
    const validate = function (req: Request, res: Response, next: NextFunction) {
        const { error } = schema.validate(req.body);
        if (error) {
         return   next(new HttpError(400, "Fill out the all fields"))
        } next()
    }; return validate
}