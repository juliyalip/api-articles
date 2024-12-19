import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();
const PORT = process.env.PORT || 4400;
const BD_HOST = process.env.BD_HOST as string

mongoose.connect(BD_HOST)
.then(()=>{
  console.log("connected to base")
}).catch((error)=>{
  console.log(error.message)
})

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});


