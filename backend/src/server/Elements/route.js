import express from "express";

export const ElementsRouter = express.Router();

ElementsRouter.get("/elements", async (req, res) => {
    res.json("hello world");
});
