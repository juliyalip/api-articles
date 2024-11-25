import express, { Request, Response, NextFunction } from 'express';
import service from './categories.service'

const categoriesRoutes = express.Router();

categoriesRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getCategories()
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})


export default categoriesRoutes
