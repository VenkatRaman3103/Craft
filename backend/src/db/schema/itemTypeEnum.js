import { pgEnum } from "drizzle-orm/pg-core";

export const itemType = pgEnum("item_type", [
    "block",
    "normal",
    "api",
    "array",
    "reference",
    "page",
    "table",
    "text_field",
    "multi_select_field",
    "single_select_field",
    "number_field",
    "email_field",
    "date_field",
    "color_picker_field",
    "textarea_field",
    "json_field",
    "url_field",
]);
