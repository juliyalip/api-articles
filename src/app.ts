import express,  {  Request, Response, NextFunction } from "express";
import cors from 'cors';
import path from 'path'
import userRoutes from "./user/user.routes";
import categoriesRoutes from "./category/categories.routes";

const app = express();
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });

app.use("/api", userRoutes)
app.use("/api/categories", categoriesRoutes)

app.use((req: Request, res: Response)=>{
res.status(404).json({message: "Page is not found"})
})

app.use((error: any, req: Request, res: Response, next:NextFunction)=>{
const {status = 500, message = "Server error" } = error;
res.status(status).json({message})
})

export default app

