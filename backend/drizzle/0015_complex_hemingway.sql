ALTER TABLE "pages_versions" RENAME COLUMN "created_at" TO "published_at";--> statement-breakpoint
ALTER TABLE "pages_versions" RENAME COLUMN "updated_at" TO "created_by";