import express from "express";

const articleRouter = express.Router()

articleRouter.get("/articles", (req, res) =>{
    res.send("")
})
articleRouter.post("/")

export default articleRouter