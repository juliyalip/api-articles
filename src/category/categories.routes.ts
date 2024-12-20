import express from 'express';
import { createCategorySchema } from '../model/category-model';
import { validateBody } from '../middelwares/validateBody';
import service from './categories.service'
import auth from '../middelwares/authentificate';
import {Role} from '../model/user-model'

const categoriesRoutes = express.Router();

categoriesRoutes.get("/",  service.getCategories)
categoriesRoutes.post("/", auth([Role.ADMIN]), validateBody(createCategorySchema), service.createCategory)

export default categoriesRoutes
