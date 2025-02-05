import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middelwares/authentificate";
import { Articles } from "../model/article-model";
import { Role } from "../model/user-model";
import HttpError from "../utils/HttpError";
import cloudinary from "./config/cloudinary";

const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 4;
  const skip = (page - 1) * limit;

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

  try {
    const { id } = req.user;
    const newArticle = { ...req.body, author: id, published: false };

    if (req.file) {

      try {
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "articles",
          public_id: `${id}_${Date.now()}`
        })
        newArticle.coverImg = cloudinaryResult.secure_url
      } catch (error) {
        next(error);
      }
    }

    const article = await Articles.create(newArticle);

    res.status(201).json(article);
  } catch (error) {

    next(error);
  }
};


const getAllUnpublishedArticles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new HttpError(403, "You have to be authorization"));
  }
  try {
    const data = await Articles.find({ published: false });
    res.status(200).json(data);
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
  try {
    const { articleId } = req.params;
    const data = await Articles.findByIdAndUpdate(articleId, req.body, {
      new: true,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const deleteArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new HttpError(403, "You have to be authorizated"));
  }
  try {
    const { role } = req.user;
    if (role !== Role.ADMIN) {
      return next(new HttpError(403, "You have to be authorizated"));
    }
    const { articleId } = req.params;
    await Articles.findByIdAndDelete(articleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllArticles,
  getAllUnpublishedArticles,
  getArticlesById,
  createArticle,
  deleteArticle,
  updateUnpublishedArticle,
};
