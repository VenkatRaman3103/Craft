import { pgTable, check, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const groups = pgTable("groups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("groups_id_not_null", sql`NOT NULL id`),
	check("groups_title_not_null", sql`NOT NULL title`),
	check("groups_created_at_not_null", sql`NOT NULL created_at`),
	check("groups_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const collections = pgTable("collections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	groupId: text("group_id"),
	parentEleId: text("parent_ele_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("collections_id_not_null", sql`NOT NULL id`),
	check("collections_name_not_null", sql`NOT NULL name`),
	check("collections_slug_not_null", sql`NOT NULL slug`),
	check("collections_created_at_not_null", sql`NOT NULL created_at`),
	check("collections_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const elements = pgTable("elements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	parentColId: text("parent_col_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("elements_id_not_null", sql`NOT NULL id`),
	check("elements_name_not_null", sql`NOT NULL name`),
	check("elements_type_not_null", sql`NOT NULL type`),
	check("elements_parent_col_id_not_null", sql`NOT NULL parent_col_id`),
	check("elements_created_at_not_null", sql`NOT NULL created_at`),
	check("elements_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const pages = pgTable("pages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	slug: text().notNull(),
	parentElementId: text("parent_element_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("pages_id_not_null", sql`NOT NULL id`),
	check("pages_name_not_null", sql`NOT NULL name`),
	check("pages_slug_not_null", sql`NOT NULL slug`),
	check("pages_created_at_not_null", sql`NOT NULL created_at`),
	check("pages_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const pageItems = pgTable("page_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	elementType: text("element_type").notNull(),
	elementId: text("element_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("page_items_id_not_null", sql`NOT NULL id`),
	check("page_items_element_type_not_null", sql`NOT NULL element_type`),
	check("page_items_element_id_not_null", sql`NOT NULL element_id`),
	check("page_items_created_at_not_null", sql`NOT NULL created_at`),
	check("page_items_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const sections = pgTable("sections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	type: text().notNull(),
	position: text().notNull(),
	parentPageId: text("parent_page_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("sections_id_not_null", sql`NOT NULL id`),
	check("sections_name_not_null", sql`NOT NULL name`),
	check("sections_type_not_null", sql`NOT NULL type`),
	check("sections_position_not_null", sql`NOT NULL "position"`),
	check("sections_parent_page_id_not_null", sql`NOT NULL parent_page_id`),
	check("sections_created_at_not_null", sql`NOT NULL created_at`),
	check("sections_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const pagesVersions = pgTable("pages_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	pageId: text("page_id").notNull(),
	contentJson: jsonb("content_json").notNull(),
	publishedAt: text("published_at").notNull(),
	createdBy: text("created_by").notNull(),
	message: text().notNull(),
}, (table) => [
	check("pages_versions_id_not_null", sql`NOT NULL id`),
	check("pages_versions_page_id_not_null", sql`NOT NULL page_id`),
	check("pages_versions_content_json_not_null", sql`NOT NULL content_json`),
	check("pages_versions_published_at_not_null", sql`NOT NULL published_at`),
	check("pages_versions_created_by_not_null", sql`NOT NULL created_by`),
	check("pages_versions_message_not_null", sql`NOT NULL message`),
]);

export const textFields = pgTable("text_fields", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	value: text().notNull(),
	sectionId: text("section_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("text_fields_id_not_null", sql`NOT NULL id`),
	check("text_fields_name_not_null", sql`NOT NULL name`),
	check("text_fields_value_not_null", sql`NOT NULL value`),
	check("text_fields_section_id_not_null", sql`NOT NULL section_id`),
	check("text_fields_created_at_not_null", sql`NOT NULL created_at`),
	check("text_fields_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const textareaFields = pgTable("textarea_fields", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	value: text().notNull(),
	sectionId: text("section_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("textarea_fields_id_not_null", sql`NOT NULL id`),
	check("textarea_fields_name_not_null", sql`NOT NULL name`),
	check("textarea_fields_value_not_null", sql`NOT NULL value`),
	check("textarea_fields_section_id_not_null", sql`NOT NULL section_id`),
	check("textarea_fields_created_at_not_null", sql`NOT NULL created_at`),
	check("textarea_fields_updated_at_not_null", sql`NOT NULL updated_at`),
]);
