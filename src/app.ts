import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Travelyn Tour Management Backend",
  });
});

export default app;
