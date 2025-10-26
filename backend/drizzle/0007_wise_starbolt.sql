ALTER TABLE "elements" ALTER COLUMN "parent_col_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "elements" ADD COLUMN "type" text NOT NULL;