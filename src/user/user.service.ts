import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import HttpError from "../utils/HttpError";
import UserDTO from "./dto/user.dto";
import { Users, Role } from "../model/user-model";
import { IUserRequest } from "../middelwares/authentificate";

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
    if (!user) {
    
      return next(new HttpError(401, "User is not authorized"));
    }
  
    if (!user.password) {
    
      return next(new HttpError(401, "Password is required"));
    }
   
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
     
      return next(new HttpError(401, "Email or password is invalid"));
    }
    
    const payload = {
      id: user._id,
      role: user.role,
    };
  
    const accessToken = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "6h" });

    res.cookie("refresh_token", refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 дней
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
    });
 
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const current = async (req:Request & {user?: IUserRequest}, res: Response, next:NextFunction)=>{

try{
  if(!req.user){
return next(new HttpError(404, "User not found"))
  }
  const user =  await Users.findById(req.user.id);
  if (!user){
    return next(new HttpError(404, "User not found"))
  }
  res.status(200).json({user: new UserDTO(user)})
}catch(error){
  next(error)
}
} 

const logout = async(req: Request & {user?: IUserRequest}, res: Response, next: NextFunction)=>{
try{
  if(!req.user){
    return next(new HttpError(404, "User not found"))
  } res.clearCookie('refresh_token')
  res.status(200).json({message: 'Logout succes'})
}catch (error){
  next(error)
}
}

const changeRole = async( req: Request, res: Response, next:NextFunction)=> {
  try{
    const {userId} = req.params;
    const user = await Users.findById(userId);
    if(!user){
      return next(new HttpError(404, "User is not found"))
    }
    const {role} = req.body;
    if(!role){
      return next (new HttpError(400, 'Role is required'))
    }
    const updateUser = await Users.findByIdAndUpdate(userId, {role}, {new: true})
    if (!updateUser){
      return next(new HttpError(500, "Server invalid"))
    }res.status(200).json({message: 'The role was updated'})

  }catch(error){
    next(error)
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction )=>{
  try{
    const data = await Users.find();

  res.status(200).json(data)
    

  }catch(error){
    next(error)
  }
}

export default { register, login , current, logout, changeRole, getUsers};
