import { relations } from "drizzle-orm";
import { projects } from "./schema.js";
import { pagesCanvas } from "../pagesCanvas/schema.js";

export const projectsRelations = relations(projects, ({ many }) => ({
    pages: many(pagesCanvas),
}));
