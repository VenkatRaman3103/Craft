ALTER TABLE "collection_pages" DROP CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk";
--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;