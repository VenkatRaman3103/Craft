import express from "express";

export const TextFieldRouter = express.Router();

TextFieldRouter.get("/text-field", async (req, res) => {
    res.json("hello from text-field");
});
