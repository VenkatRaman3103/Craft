CREATE TYPE "public"."scope_enum" AS ENUM('global', 'page', 'collection');--> statement-breakpoint
CREATE TYPE "public"."page_item_type" AS ENUM('block', 'text_field', 'multi_select_field');--> statement-breakpoint
CREATE TABLE "array_block_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"array_block_ref_id" uuid,
	"item_type" text NOT NULL,
	"reference_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "array_blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'array' NOT NULL,
	"reference_id" text DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'normal' NOT NULL,
	"reference_id" text DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "child" (
	"child_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"parent_ref_id" uuid,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "multi_select_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "multi_select_options" (
	"option_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field_id" uuid NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"is_selected" boolean DEFAULT false NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "text_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"type" varchar DEFAULT 'text' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_ref_id" uuid,
	"item_type" "page_item_type" NOT NULL,
	"reference_id" uuid NOT NULL
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
CREATE TABLE "parent" (
	"parent_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "array_block_items" ADD CONSTRAINT "array_block_items_array_block_ref_id_array_blocks_block_id_fk" FOREIGN KEY ("array_block_ref_id") REFERENCES "public"."array_blocks"("block_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child" ADD CONSTRAINT "child_parent_ref_id_parent_parent_id_fk" FOREIGN KEY ("parent_ref_id") REFERENCES "public"."parent"("parent_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_collection_ref_id_collections_collection_id_fk" FOREIGN KEY ("collection_ref_id") REFERENCES "public"."collections"("collection_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multi_select_options" ADD CONSTRAINT "multi_select_options_field_id_multi_select_fields_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."multi_select_fields"("field_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_items" ADD CONSTRAINT "page_items_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;