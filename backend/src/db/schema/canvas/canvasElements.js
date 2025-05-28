import {
    boolean,
    integer,
    json,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const canvasElements = pgTable("canvas_elements", {
    id: serial("id").primaryKey(),
    elementId: integer("element_id").notNull().unique(),
    type: varchar("type", { length: 50 }).notNull(),
    x: integer("x").default(0),
    y: integer("y").default(0),
    width: integer("width").default(100),
    height: integer("height").default(100),
    color: varchar("color", { length: 50 }),
    text: varchar("text", { length: 255 }),
    isGroup: boolean("is_group").default(false),
    groupLevel: integer("group_level").default(0),
    children: json("children"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
