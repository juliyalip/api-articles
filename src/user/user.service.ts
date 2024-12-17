import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import HttpError from "../utils/HttpError";
import { Users, Role } from "../model/user-model";

dotenv.config();

const SECRET = process.env.SECRET as string;


const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const duplicateUser = await Users.findOne({ email });
    if (duplicateUser) {
      return next(new HttpError(409, "Email already in use"));
    }
    const solt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, solt);
    const newUser = await Users.create({
      ...req.body,
      password: hashPassword,
      role: Role.USER,
    });
    res.status(201).json({name: newUser.name})
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user || !user.password) {
      return next(new HttpError(401, "email or password is invalide"));
    }
    const passwordCompare = bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return next(new HttpError(401, "email or password is invalide"));
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "6h" });
    res.cookie("refresh_token", refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export default { register, login };
