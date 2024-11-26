import { Schema, model } from "mongoose";
import Joi from 'joi'

const categorySchema = new Schema({
    title: {type: String, require: true},
    url: {type: String, require: true},
      articles: [{type: Schema.Types.ObjectId,
        ref: "articles",
        require: true
    }]
})

export const Categories = model("categories", categorySchema) 