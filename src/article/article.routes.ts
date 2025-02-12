import express from "express";
import service from './article.service'
import auth from '../middelwares/authentificate';
import { Role } from "../model/user-model";
import { validateBody } from "../middelwares/validateBody";
import { createArticleSchema } from "../model/article-model";
import { upload } from "../middelwares/upload";

const articleRoutes = express.Router();

articleRoutes.get('/',  service.getAllArticles);
articleRoutes.get('/popular', service.getPopularArticles)
articleRoutes.get('/unpublished', auth([Role.ADMIN, Role.USER]),  service.getAllUnpublishedArticles)
articleRoutes.get('/:articleId', service.getArticlesById)
articleRoutes.post('/', auth([Role.USER, Role.ADMIN]), upload.single("coverImg"), validateBody(createArticleSchema), service.createArticle)
articleRoutes.patch('/:articleId/published', auth([Role.ADMIN, Role.USER]), service.updateUnpublishedArticle)

articleRoutes.delete('/:articleId', auth([Role.ADMIN]), service.deleteArticle)

export default articleRoutes