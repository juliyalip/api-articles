import express from "express";
import './app.js'
const app = express();




app.listen(8800, () => {
  console.log("Connected");
});
