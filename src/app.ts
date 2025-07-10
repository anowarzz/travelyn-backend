import cors from "cors";
import express from "express";
import router from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors());



app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Travelyn Tour Management Backend",
  });
});

export default app;
