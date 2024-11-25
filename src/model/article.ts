import { Schema, model } from "mongoose";
import Joi from 'joi'

export const articleSchema = new Schema(
    {
        country: {type: String, require: true},
        city: {type: String, require: true},
        description: { type: String, require: true},
        spoiler: {type: String, require: true},
        coverImg: {type: String},
        published: {type: Boolean, require: true}
            }
           
);

export const Articles = model("articles", articleSchema)

