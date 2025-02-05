import  { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'
import HttpError from '../utils/HttpError'
import { Role, Users} from '../model/user-model'
import { Multer } from "multer";

const { SECRET } = process.env;

export interface IUserRequest {
    id:ObjectId,
    role: Role
}

export interface CustomRequest extends Request {
    user?: IUserRequest,
      file?: Express.Multer.File,
      }


const auth = (roles: Role[] = []) => async (req: CustomRequest, res: Response, next: NextFunction) => {
      const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== "Bearer" || !token) {
        return next(new HttpError(401, "Unauthorized"));
    }

    try {
        const { id, role } = jwt.verify(token, SECRET as string) as { id: ObjectId; role: Role };

        const user = await Users.findById(id);
        if (!user || (roles.length > 0 && !roles.includes(role))) {
            return next(new HttpError(403, "No permissions"));
        }

        req.user = { id, role };
        next();
    } catch (err) {
        return next(new HttpError(401, "Invalid or expired token"));
    }
};

export default auth;


