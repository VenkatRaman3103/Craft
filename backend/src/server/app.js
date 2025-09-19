import { app } from "./server.js";

// define your routes here
app.get("/api", (req, res) => {
    res.json("hello world");
});
