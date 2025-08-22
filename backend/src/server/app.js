import { getConfig } from "../utils/getConfig.js";
import { collectionsRouter } from "./collections/route.js";
import { app } from "./server.js";

// define your routes here
app.get("/api", (req, res) => {
    const config = getConfig();
    console.log(config);
    res.json(config);
});

app.use("/api", collectionsRouter);
