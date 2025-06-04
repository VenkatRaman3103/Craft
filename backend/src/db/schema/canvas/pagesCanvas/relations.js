import { relations } from "drizzle-orm";
import { pagesCanvas } from "./schema";
import { projectsCanvas } from "../projectCanvas/schema";

export const pagesCanvasRelations = relations(pagesCanvas, ({ one }) => ({
    project: one(projectsCanvas, {
        fields: [pagesCanvas.page_id],
        references: [projectsCanvas.project_id],
    }),
}));
