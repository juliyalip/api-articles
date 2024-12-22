import {Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middelwares/authentificate";
import { Articles } from "../model/article-model";
import HttpError from "../utils/HttpError";

const getAllArticles = async (req: Request, res: Response, next: NextFunction )=>{
     try{
        const data = await Articles.find();
        res.status(200).json(data)
     }catch(error){
        next(error)
     }
}

const getArticlesById = async (req: Request, res: Response, next: NextFunction) =>{
   try{
      const {articleId} = req.params;
      const article = await Articles.findById(articleId);
      res.status(200).json(article)
   }catch(error){
      next(error)
   }
}

const createArticle = async (req: CustomRequest, res: Response, next: NextFunction)=>{
   if (!req.user){
return next(new HttpError(403, 'You have to be authorization'))
   }
try{
   const {id} = req.user;
   const newArticle = {...req.body,
      author: id,
      published: false
   }
   const article = await Articles.create(newArticle);
   res.status(201).json(article)

}catch(error){
   next(error)
}
}



export default {getAllArticles, getArticlesById, createArticle}