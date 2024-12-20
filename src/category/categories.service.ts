import { Request, Response, NextFunction } from 'express';
import { Categories } from '../model/category-model';

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Categories.find();
        res.status(200).json(data)

    } catch (error) {
        next(error)
    }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, url } = req.body;
      
        const category = await Categories.create({ title, url })
        res.status(201).json(category)
    } catch (error) {
        next(error)
    }
}

export default { getCategories, createCategory }



