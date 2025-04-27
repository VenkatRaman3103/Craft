import express from "express";

export const tableColumsRoute = express.Router();

tableColumsRoute.get("/columns/test", (req, res) => {
    res.json("Hello from tableColumsRoute");
});
