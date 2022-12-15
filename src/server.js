import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoute from "./routes/web";
import connectDB from "./config/connectDB";
import cors from "cors";

require("dotenv").config();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.json());

// config app
viewEngine(app);
initWebRoute(app);

connectDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("App is running on port: " + port);
});
