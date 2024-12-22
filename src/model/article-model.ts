import { Schema, model } from "mongoose";
import Joi from 'joi'
import { Categories } from "./category-model";
import { title } from "process";


export const articleSchema = new Schema(
    {
        country: {type: String, require: true},
        city: {type: String, require: true},
        title: {type: String, require: true},
        description: { type: String, require: true},
        spoiler: {type: String, require: true},
        coverImg: {type: String},
        published: {type: Boolean, require: true},
        category: {type: Schema.Types.ObjectId, ref: "categories", require: true},
        author: {type: Schema.Types.ObjectId, ref: "users", require: true}
            },
           
            {
                versionKey: false, 
              }
          
);

export const createArticleSchema = Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    description: Joi.string().required(),
    title: Joi.string().required(),
        spoiler: Joi.string().required(),
        coverImg: Joi.string(),
            category: Joi.string().custom(async (creategoryId, helpers)=>{
            const categoryId = await Categories.find({_id: creategoryId})
            if(!categoryId){
                return helpers.error('any.invalid', {message: "Invalid category"})
            }
            return categoryId
        }).required(),
        
})

export const Articles = model("articles", articleSchema)

