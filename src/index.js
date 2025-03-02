import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { ApiResponse } from "./utils/ApiResponse.js";

dotenv.config({
    path: './.env'
})

app.get("/", (req, res) => {
    res.send(new ApiResponse(200, [], "Welcome to the root route!"));
  });


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


