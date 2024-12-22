import express from "express";
import service from './article.service'
import auth from '../middelwares/authentificate';
import { Role } from "../model/user-model";
import { validateBody } from "../middelwares/validateBody";
import { createArticleSchema } from "../model/article-model";

const articleRoutes = express.Router();

articleRoutes.get('/',  service.getAllArticles);
articleRoutes.get('/:articleId', service.getArticlesById)
articleRoutes.post('/', auth([Role.USER, Role.ADMIN]), validateBody(createArticleSchema), service.createArticle)

articleRoutes.delete('/:articleId', auth([Role.ADMIN]), service.deleteArticle)

export default articleRoutes