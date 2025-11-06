import express from "express";

export const StructuredContentRouter = express.Router();

StructuredContentRouter.get("/", (req, res) => {
    res.send("hello StructuredContentRouter");
});
