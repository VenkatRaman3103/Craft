CREATE TABLE "blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"scope" text DEFAULT null,
	"reference_id" text DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collection_pages" (
	"collection_ref_id" uuid NOT NULL,
	"page_ref_id" uuid NOT NULL,
	CONSTRAINT "collection_pages_collection_ref_id_page_ref_id_pk" PRIMARY KEY("collection_ref_id","page_ref_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"collection_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"slug" text NOT NULL,
	"type" text,
	"reference_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"page_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_collection_ref_id_collections_collection_id_fk" FOREIGN KEY ("collection_ref_id") REFERENCES "public"."collections"("collection_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;