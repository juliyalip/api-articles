import { Request, Response, NextFunction } from "express";
import fs from 'fs/promises'
import { getOptimizeImg } from "../utils/getOptimazeImg";
import { CustomRequest } from "../middelwares/authentificate";
import { Articles } from "../model/article-model";
import { Role } from "../model/user-model";
import { getPaginationParams } from "../utils/getPaginationParams";
import HttpError from "../utils/HttpError";
import { wrapperComponent } from "../utils/wrapperComponent";
import cloudinary from "./config/cloudinary";

const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { limit, skip } = getPaginationParams(req.query);

  try {
    const data = await Articles.find({ published: true }, null, {
      skip,
      limit,
    });
    const hasMoreArticles = data.length === limit;
    res.status(200).json({ data, hasMoreArticles });
  } catch (error) {
    next(error);
  }
};

const getPopularArticles = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = getPaginationParams(req.query);

    const data = await Articles.find({ published: true, city: "Malbork" }, null,
      { skip, limit })
    const hasMoreArticles = data.length === limit;
    res.status(200).json({ data, hasMoreArticles })

  } catch (error) {
    console.log(error)
  }
}

const getArticlesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.findById(articleId);
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};



const createArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  if (!req.user) {
    return next(new HttpError(403, "You have to be authorized"));
  }

  const { id } = req.user;
  const newArticle = { ...req.body, author: id, published: false };

  if (req.file) {

    try {
      const tempPath = await getOptimizeImg(req.file.path);
      const { secure_url: coverImg, public_id: idColudImg } = await cloudinary.uploader.upload(tempPath, {
        folder: "articles",
        transformation: { width: 300, crop: 'fill' }
      })
      newArticle.coverImg = coverImg;
      newArticle.idCloudImg = idColudImg;

      await fs.unlink(tempPath)
    } catch (error) {
      next(error);
    }
  }

  const article = await Articles.create(newArticle);

  res.status(201).json(article);

};


const getAllUnpublishedArticles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new HttpError(403, "You have to be authorization"));
  }
  const { limit, skip } = getPaginationParams(req.query);
  try {
    const data = await Articles.find({ published: false }, null, {
      skip,
      limit
    })
    const hasMoreArticles = data.length === limit;
    res.status(200).json({ data, hasMoreArticles });
  } catch (error) {
    console.log(error);
  }
};

const updateUnpublishedArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new HttpError(403, "You have to be authorization"));
  }

  const { articleId } = req.params;
  const data = await Articles.findByIdAndUpdate(articleId, req.body, {
    new: true,
  });
  res.status(200).json(data);

};

const deleteArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new HttpError(403, "You have to be authorizated"));
  }

  const { role } = req.user;
  if (role !== Role.ADMIN) {
    return next(new HttpError(403, "You have to be authorizated"));
  }
  const { articleId } = req.params;
  await Articles.findByIdAndDelete(articleId);
  res.status(204).send();

};

export default {
  getAllArticles,
  getAllUnpublishedArticles: wrapperComponent(getAllUnpublishedArticles),
  getArticlesById,
  createArticle: wrapperComponent(createArticle),
  deleteArticle: wrapperComponent(deleteArticle),
  updateUnpublishedArticle,
  getPopularArticles
};
