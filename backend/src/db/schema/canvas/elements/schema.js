import {
    boolean,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { pagesCanvas } from "../pagesCanvas/schema.js";
import { relations } from "drizzle-orm";

export const elements = pgTable("elements", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
        .references(() => pagesCanvas.id, { onDelete: "cascade" })
        .notNull(),
    parentId: uuid("parent_id").references(() => elements.id, {
        onDelete: "cascade",
    }),
    type: text("type").notNull(),
    name: text("name"),
    order: integer("order").notNull().default(0),

    content: text("content"),

    styles: jsonb("styles").notNull().default({}),

    attributes: jsonb("attributes").default({}),

    responsiveStyles: jsonb("responsive_styles").default({
        mobile: {},
        tablet: {},
        desktop: {},
    }),

    isVisible: boolean("is_visible").default(true),
    isLocked: boolean("is_locked").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const elementsRelations = relations(elements, ({ one, many }) => ({
    page: one(pagesCanvas, {
        fields: [elements.pageId],
        references: [pagesCanvas.id],
    }),
    parent: one(elements, {
        fields: [elements.parentId],
        references: [elements.id],
        relationName: "parent_child",
    }),
    children: many(elements, {
        relationName: "parent_child",
    }),
}));
