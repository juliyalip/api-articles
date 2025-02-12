import { Request, Response, NextFunction } from "express";
import { getPaginationParams } from "../utils/getPaginationParams";
import { Categories } from "../model/category-model";
import { Articles } from "../model/article-model";

const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await Categories.find();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.params;
        const { limit, skip } = getPaginationParams(req.query);

        const getCategory = String(category).charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        const data = await Articles.find({ country: getCategory, published: true }, null, {
            skip,
            limit
        });
        const hasMoreArticles = data.length === limit;
        res.status(200).json({ data, hasMoreArticles });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, url } = req.body;
        const category = await Categories.create({ title, url });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export default { getCategories, createCategory, getCategory };
