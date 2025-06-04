import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const projectsCanvas = pgTable("projects_canvas", {
    project_id: uuid("project_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: text("status"),
});
