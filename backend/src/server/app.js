import { collectionsRouter } from "./Collections/route.js";
import { ElementsRouter } from "./Elements/route.js";
import { TextFieldRouter } from "./Fields/TextField/route.js";
import { groupsRouter } from "./Groups/route.js";
import { PagesVersionRouter } from "./Pages/PagesVersion/route.js";
import { PagesRouter } from "./Pages/route.js";
import { SectionsRouter } from "./Section/route.js";
import { app } from "./server.js";
import { StructuredContentRouter } from "./StructuredContent/route.js";

// define your routes here
app.get("/api", (_, res) => {
    res.json("hello world");
});

// routes
app.use("/api", groupsRouter);
app.use("/api", collectionsRouter);
app.use("/api", ElementsRouter);
app.use("/api", PagesRouter);
app.use("/api", StructuredContentRouter);
app.use("/api", SectionsRouter);
app.use("/api", PagesVersionRouter);

// fields route
app.use("/api", TextFieldRouter);
