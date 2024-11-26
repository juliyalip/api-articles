import express from 'express'
import service from './user.service'

const userRoutes = express.Router()

userRoutes.post("/register" , service.register)
userRoutes.post("/login")

export default userRoutes