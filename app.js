import mongoose from "mongoose";
import 'dotenv/config'
const {BD_Host} = process.env

mongoose
  .connect(BD_Host)
  .then(() => {
    console.log("connected to base");
  })
  .catch((error) => {
    console.log("error", error.message);
    process.exit(1)
  });