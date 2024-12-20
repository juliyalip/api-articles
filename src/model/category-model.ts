import { Schema, model } from "mongoose";
import Joi from 'joi'

const categorySchema = new Schema({
    title: {type: String, require: true},
    url: {type: String, require: true},
   },
   {
    versionKey: false, 
  })

export const createCategorySchema = Joi.object({
  title: Joi.string().min(3).required(),
  url: Joi.string().min(3).required()
})

export const Categories = model("categories", categorySchema);
