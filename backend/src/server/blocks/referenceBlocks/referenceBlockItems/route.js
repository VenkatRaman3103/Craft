import express from "express";

export const referenceBlockItemsRouter = express.Router();

referenceBlockItemsRouter.get("/test-route", async (req, res) => {
    res.json("Hello from referenceBlockItemsRouter");
});
