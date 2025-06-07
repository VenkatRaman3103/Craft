import { relations } from "drizzle-orm";
import { pagesCanvas } from "../pagesCanvas/schema.js";
import { projectsCanvas } from "./schema.js";

export const projectsCanvasRelations = relations(
    projectsCanvas,
    ({ many }) => ({
        pages: many(pagesCanvas),
    }),
);
