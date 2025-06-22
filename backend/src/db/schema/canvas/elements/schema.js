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
        .references(() => pagesCanvas.page_id, { onDelete: "cascade" })
        .notNull(),
    parentId: uuid("parent_id").references(() => elements.id, {
        onDelete: "cascade",
    }), // Self-reference for nested elements
    type: text("type").notNull(), // 'div', 'text', 'image', 'button', etc.
    name: text("name"), // User-friendly name
    order: integer("order").notNull().default(0), // For element ordering within parent

    // Content properties
    content: text("content"), // For text elements, image src, etc.

    // CSS Styles - stored as JSONB for flexibility
    styles: jsonb("styles").notNull().default({}), // All CSS properties

    // Element-specific properties
    attributes: jsonb("attributes").default({}), // HTML attributes like href, alt, etc.

    // Responsive styles (optional - for advanced features)
    responsiveStyles: jsonb("responsive_styles").default({
        mobile: {},
        tablet: {},
        desktop: {},
    }),

    // Visibility and state
    isVisible: boolean("is_visible").default(true),
    isLocked: boolean("is_locked").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    contentSource: text("content_source"),
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
