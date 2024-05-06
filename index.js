import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json())

const { BD_Host } = process.env;

const PORT =  BD_Host || 8800;

mongoose
  .connect(BD_Host)
  .then(() => {
    console.log("connected to base");
    app.listen(PORT, () => {
      console.log("Connected");
    });
  })
  .catch((error) => {
    console.log("error", error.message);
    process.exit(1);
  });
