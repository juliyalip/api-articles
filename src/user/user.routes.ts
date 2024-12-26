import express from 'express'
import service from './user.service'
import auth from '../middelwares/authentificate'
import { Role } from '../model/user-model';

console.log("userRoutes loaded");

const userRoutes = express.Router()


userRoutes.get("/current", auth(), service.current)
userRoutes.post("/register", service.register)
userRoutes.post("/login", service.login)
userRoutes.post("/update-tokens", service.updateAllTokens)
userRoutes.post('/logout' , service.logout)

userRoutes.get('/users', auth([Role.ADMIN]), service.getUsers)

userRoutes.patch('/users/:userId/role', auth([Role.ADMIN]), service.changeRole)

export default userRoutes