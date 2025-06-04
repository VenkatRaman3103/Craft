import express from "express";

export const projectCanvasRouter = express.Router();

projectCanvasRouter.get("/projects-canvas", async (req, res) => {
    res.json("hello from projectCanvasRouter");
});
