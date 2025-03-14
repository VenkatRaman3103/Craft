import { pgEnum } from "drizzle-orm/pg-core";

export const fieldScopeEnums = pgEnum("field_scope_enum", [
    "global",
    "collection",
    "block",
    "page",
]);
