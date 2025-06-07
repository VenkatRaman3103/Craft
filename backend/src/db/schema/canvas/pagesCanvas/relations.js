import { relations } from "drizzle-orm";
import { pagesCanvas } from "./schema.js";
import { projectsCanvas } from "../projectCanvas/schema.js";
import { elements } from "../elements/schema.js";

export const pagesCanvasRelations = relations(pagesCanvas, ({ one, many }) => ({
    project: one(projectsCanvas, {
        fields: [pagesCanvas.project_id],
        references: [projectsCanvas.project_id],
    }),
    elements: many(elements),
}));
