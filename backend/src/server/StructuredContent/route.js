import express from "express";

export const StructuredContentRouter = express.Router();

StructuredContentRouter.get("/structured-content", (req, res) => {
    res.json("hello StructuredContentRouter");
});
