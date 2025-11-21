import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const pageItems = pgTable("page_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	elementType: text("element_type").notNull(),
	elementId: text("element_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const pagesVersions = pgTable("pages_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	pageId: text("page_id").notNull(),
	versionNumber: text("version_number"),
	contentJson: jsonb("content_json").notNull(),
	publishedAt: text("published_at").notNull(),
	createdBy: text("created_by").notNull(),
});

export const sections = pgTable("sections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	parentPageId: text("parent_page_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	type: text().notNull(),
	position: text().notNull(),
});

export const groups = pgTable("groups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const collections = pgTable("collections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	groupId: text("group_id"),
	parentEleId: text("parent_ele_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const pages = pgTable("pages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	parentElementId: text("parent_element_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const elements = pgTable("elements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	parentColId: text("parent_col_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	type: text().notNull(),
});
