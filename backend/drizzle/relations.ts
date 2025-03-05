import { relations } from "drizzle-orm/relations";
import { parent, child, pages, pageItems, collections, collectionPages } from "./schema";

export const childRelations = relations(child, ({one}) => ({
	parent: one(parent, {
		fields: [child.parentRefId],
		references: [parent.parentId]
	}),
}));

export const parentRelations = relations(parent, ({many}) => ({
	children: many(child),
}));

export const pageItemsRelations = relations(pageItems, ({one}) => ({
	page: one(pages, {
		fields: [pageItems.pageRefId],
		references: [pages.pageId]
	}),
}));

export const pagesRelations = relations(pages, ({many}) => ({
	pageItems: many(pageItems),
	collectionPages: many(collectionPages),
}));

export const collectionPagesRelations = relations(collectionPages, ({one}) => ({
	collection: one(collections, {
		fields: [collectionPages.collectionRefId],
		references: [collections.collectionId]
	}),
	page: one(pages, {
		fields: [collectionPages.pageRefId],
		references: [pages.pageId]
	}),
}));

export const collectionsRelations = relations(collections, ({many}) => ({
	collectionPages: many(collectionPages),
}));