import express from 'express';
import service from './categories.service'

const categoriesRoutes = express.Router();

categoriesRoutes.get("/",  service.getCategories)
categoriesRoutes.post("/", service.createCategory)

export default categoriesRoutes
