import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projectsCanvas } from "../projectCanvas/schema.js";

export const pagesCanvas = pgTable("pages_canvas", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: text("status"),
    project_id: uuid("project_id")
        .references(() => projectsCanvas.project_id)
        .notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});
