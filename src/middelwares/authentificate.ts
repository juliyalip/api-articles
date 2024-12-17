import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import HttpError from '../utils/HttpError'
import { Role, Users } from '../model/user-model'

const { SECRET } = process.env;

interface IUserRequest {
    id: string,
    role: Role
}

interface CustomRequest extends Request {
    user?: IUserRequest
}

const auth = (roles: Role[] = []) => async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return next(new HttpError(401, "Unauthorized"));
    }

    try {
        const { id, role } = jwt.verify(token, SECRET as string) as { id: string, role: Role };

        const user = await Users.findById(id);
        if (!user || (!roles.length || !roles.includes(role))) {
            return next(new HttpError(403, "No permissions"));
        }

        req.user = { id, role };
        next();
    } catch (err) {
        next(new HttpError(401, "Invalid Token"));
    }
};

export default auth;

