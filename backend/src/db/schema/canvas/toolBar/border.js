import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const border_table = pgTable("border_table", {
    id: uuid("id").primaryKey().defaultRandom(),
    element_id: text("element_id").notNull(),
    border_style: text("border_style"),
    border_width: text("border_width"),
    border_radius: text("border_radius"),
    border_top_left_radius: text("border_top_left_radius"),
    border_top_rigth_radius: text("border_top_rigth_radius"),
    border_bottom_rigth_radius: text("border_bottom_rigth_radius"),
    border_bottom_left_radius: text("border_bottom_left_radius"),
    border_top_width: text("border_top_width"),
    border_bottom_width: text("border_bottom_width"),
    border_rigth_width: text("border_rigth_width"),
    border_left_width: text("border_left_width"),
    active_side_width: text("active_side_width"),
    active_side_radius: text("active_side_radius"),
});
