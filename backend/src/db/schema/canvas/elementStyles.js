import {
    boolean,
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const elementStyles = pgTable("element_styles", {
    id: serial("id").primaryKey(),
    elementId: integer("element_id").notNull(),

    // Border styles
    borderRadius: integer("border_radius").default(0),
    topLeftRadius: integer("top_left_radius").default(0),
    topRightRadius: integer("top_right_radius").default(0),
    bottomLeftRadius: integer("bottom_left_radius").default(0),
    bottomRightRadius: integer("bottom_right_radius").default(0),

    borderWidth: integer("border_width").default(1),
    topWidth: integer("top_width").default(1),
    bottomWidth: integer("bottom_width").default(1),
    leftWidth: integer("left_width").default(1),
    rightWidth: integer("right_width").default(1),
    borderStyle: varchar("border_style", { length: 20 }).default("solid"),

    // Alignment styles
    alignItems: varchar("align_items", { length: 20 }),
    justifyContent: varchar("justify_content", { length: 20 }),
    flexDirection: varchar("flex_direction", { length: 20 }),
    isReversed: boolean("is_reversed").default(false),
    gap: integer("gap").default(0),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
