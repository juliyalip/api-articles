import { Schema, model } from "mongoose";
import Joi from 'joi'
import { Categories } from "./category-model";

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
    category: Joi.string().required().external(async (categoryId) => {
        const category = await Categories.findById(categoryId);
        if (!category) {
            throw new Error("Invalid category");
        }
        return categoryId;
    }),
});


export const Articles = model("articles", articleSchema)

