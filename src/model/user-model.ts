import { Schema, model } from "mongoose";
import Joi from 'joi';

const emailRegexp =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

export enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

const userSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, enum: Object.values(Role), default: Role.USER}
})

export const Users = model("users", userSchema)

const registerSchema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(4).required()
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(3).required()
})

export default{registerSchema, loginSchema}