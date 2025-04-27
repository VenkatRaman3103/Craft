import express from "express";

export const tableRowsRoute = express.Router();

tableRowsRoute.get("/rows/test", async (req, res) => {
    res.json("Hello world");
});
