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
CREATE TABLE "block_types" (
	"block_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"block_type_id" uuid NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "field_definitions" (
	"field_def_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_type_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"type" varchar NOT NULL,
	"required" boolean DEFAULT false,
	"default_value" jsonb,
	"options" jsonb,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "field_values" (
	"field_value_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"field_def_id" uuid NOT NULL,
	"value" jsonb NOT NULL
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
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_page_id_pages_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_block_type_id_block_types_block_type_id_fk" FOREIGN KEY ("block_type_id") REFERENCES "public"."block_types"("block_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_definitions" ADD CONSTRAINT "field_definitions_block_type_id_block_types_block_type_id_fk" FOREIGN KEY ("block_type_id") REFERENCES "public"."block_types"("block_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_values" ADD CONSTRAINT "field_values_block_id_blocks_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."blocks"("block_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_values" ADD CONSTRAINT "field_values_field_def_id_field_definitions_field_def_id_fk" FOREIGN KEY ("field_def_id") REFERENCES "public"."field_definitions"("field_def_id") ON DELETE no action ON UPDATE no action;