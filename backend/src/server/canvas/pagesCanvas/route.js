import express from "express";

export const pagesCanvasRouter = express.Router();

pagesCanvasRouter.get("/pages", async (req, res) => {
    res.json("hello from pagesCanvasRouter");
});
