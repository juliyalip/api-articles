import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'
import HttpError from '../utils/HttpError'
import { Role, Users, TUser } from '../model/user-model'

const { SECRET } = process.env;

export interface IUserRequest {
    id:ObjectId,
    role: Role
}

interface CustomRequest extends Request {
    user?: IUserRequest
}

const auth = (roles: Role[] = []) => async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {authorization = ''} = req.headers;
    const [bearer, token] = authorization.split(' ')

    if (bearer !== "Bearer") {
        return next(new HttpError(401, "Unauthorized"));
    }

    try {
        const { id, role } = jwt.verify(token, SECRET as string) as { id: ObjectId, role: Role };

        const user = await Users.findById(id);
        if (!user || (!roles.length || !roles.includes(role))) {
            return next(new HttpError(403, "No permissions"));
        }

        req.user = { id, role };
        next();
    } catch (err) {
       const refreshToken = req.cookies['refresh_token'];
       if(!refreshToken){
        return next(new HttpError(401, 'Unautorization'))
       }
       try{
        const decodedRefresh = jwt.verify(refreshToken, SECRET as string) as { id: ObjectId; role: Role };
      const newAccessToken = jwt.sign({ id: decodedRefresh.id, role: decodedRefresh.role }, SECRET as string, { expiresIn: '1h' });
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      req.user = { id: decodedRefresh.id, role: decodedRefresh.role };
      next();
    } catch (refreshError) {
      return next(new HttpError(401, "Invalid refresh token"));
    }
    }
};

export default auth;

