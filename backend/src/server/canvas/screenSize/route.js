import express from "express";

export const screenSizeRouter = express.Router();

screenSizeRouter.get("/screen-size", async (req, res) => {
    res.json("hello from screen-size");
});
