import { pgEnum } from "drizzle-orm/pg-core";

export const scopeEnum = pgEnum("scope_enum", ["global", "page", "collection"]);
