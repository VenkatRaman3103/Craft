CREATE TYPE "public"."scope_enum" AS ENUM('global', 'page', 'collection');--> statement-breakpoint
CREATE TYPE "public"."url_type_enum" AS ENUM('http', 'https');--> statement-breakpoint
CREATE TYPE "public"."field_scope_enum" AS ENUM('global', 'collection', 'block', 'page');--> statement-breakpoint
CREATE TYPE "public"."item_type" AS ENUM('block', 'normal', 'api', 'array', 'reference', 'page', 'table', 'text_field', 'multi_select_field', 'single_select_field', 'number_field', 'email_field', 'date_field', 'color_picker_field', 'textarea_field', 'json_field', 'url_field');--> statement-breakpoint
CREATE TABLE "block_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_block_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"order" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "canvas_elements" (
	"id" serial PRIMARY KEY NOT NULL,
	"element_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"x" integer DEFAULT 0,
	"y" integer DEFAULT 0,
	"width" integer DEFAULT 100,
	"height" integer DEFAULT 100,
	"color" varchar(50),
	"text" varchar(255),
	"is_group" boolean DEFAULT false,
	"group_level" integer DEFAULT 0,
	"children" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "canvas_elements_element_id_unique" UNIQUE("element_id")
);
--> statement-breakpoint
CREATE TABLE "element_styles" (
	"id" serial PRIMARY KEY NOT NULL,
	"element_id" integer NOT NULL,
	"border_radius" integer DEFAULT 0,
	"top_left_radius" integer DEFAULT 0,
	"top_right_radius" integer DEFAULT 0,
	"bottom_left_radius" integer DEFAULT 0,
	"bottom_right_radius" integer DEFAULT 0,
	"border_width" integer DEFAULT 1,
	"top_width" integer DEFAULT 1,
	"bottom_width" integer DEFAULT 1,
	"left_width" integer DEFAULT 1,
	"right_width" integer DEFAULT 1,
	"border_style" varchar(20) DEFAULT 'solid',
	"align_items" varchar(20),
	"justify_content" varchar(20),
	"flex_direction" varchar(20),
	"is_reversed" boolean DEFAULT false,
	"gap" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "screen_size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"heigth" text NOT NULL,
	"width" text NOT NULL,
	"screen_type" text DEFAULT 'desktop',
	"status" text DEFAULT 'in-active',
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
CREATE TABLE "collection_items" (
	"collection_item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_ref_id" uuid NOT NULL,
	"item_type" "item_type" NOT NULL,
	"reference_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
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
CREATE TABLE "color_picker_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hex" varchar(7) NOT NULL,
	"rgb" jsonb NOT NULL,
	"rgba" jsonb NOT NULL,
	"hsl" jsonb NOT NULL,
	"hsla" jsonb NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar(7) NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"type" varchar DEFAULT 'colorPicker' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "date_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"type" varchar DEFAULT 'date' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"type" varchar DEFAULT 'email' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "json_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" jsonb NOT NULL,
	"type" varchar DEFAULT 'json_fields' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "number_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" integer NOT NULL,
	"type" varchar DEFAULT 'number' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "textarea_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" text NOT NULL,
	"type" varchar DEFAULT 'textarea' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "url_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"url_type" "url_type_enum" DEFAULT 'http',
	"type" varchar DEFAULT 'url' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "multi_select_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"type" varchar DEFAULT 'multi_select' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
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
	"display_order" integer,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "single_select_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"label" varchar NOT NULL,
	"type" varchar DEFAULT 'single_select' NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "single_select_options" (
	"option_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field_id" uuid NOT NULL,
	"label" varchar NOT NULL,
	"value" varchar NOT NULL,
	"is_selected" boolean DEFAULT false NOT NULL,
	"display_order" integer,
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
	"required" boolean DEFAULT false NOT NULL,
	"scope" "field_scope_enum" DEFAULT 'page' NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_ref_id" uuid,
	"item_type" "item_type" NOT NULL,
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
CREATE TABLE "array_blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'array' NOT NULL,
	"reference_id" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "array_block_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_block_id" uuid NOT NULL,
	"parent_template_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"order" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "array_block_templates" (
	"template_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now(),
	"block_type" text DEFAULT 'array',
	"array_block_id" uuid NOT NULL,
	"array_block_item_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "table_blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'table' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "table_columns" (
	"column_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"table_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "table_rows" (
	"row_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"table_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "table_entries" (
	"entry_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"row_id" uuid NOT NULL,
	"column_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reference_blocks" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"block_type" text DEFAULT 'reference' NOT NULL,
	"reference_type" text DEFAULT 'all' NOT NULL,
	"collection_id" text,
	"content" text,
	"scope" "scope_enum" DEFAULT 'global',
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reference_block_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_block" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" text,
	"response" text,
	"scope" "scope_enum" DEFAULT 'global',
	"block_type" text DEFAULT 'api' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "border_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"element_id" text NOT NULL,
	"border_style" text,
	"border_width" text,
	"border_radius" text,
	"border_top_left_radius" text,
	"border_top_rigth_radius" text,
	"border_bottom_rigth_radius" text,
	"border_bottom_left_radius" text,
	"border_top_width" text,
	"border_bottom_width" text,
	"border_rigth_width" text,
	"border_left_width" text,
	"active_side_width" text,
	"active_side_radius" text
);
--> statement-breakpoint
CREATE TABLE "projects_canvas" (
	"project_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" text,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages_canvas" (
	"page_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" text,
	"project_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "child" ADD CONSTRAINT "child_parent_ref_id_parent_parent_id_fk" FOREIGN KEY ("parent_ref_id") REFERENCES "public"."parent"("parent_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_collection_ref_id_collections_collection_id_fk" FOREIGN KEY ("collection_ref_id") REFERENCES "public"."collections"("collection_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD CONSTRAINT "collection_pages_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_ref_id_collections_collection_id_fk" FOREIGN KEY ("collection_ref_id") REFERENCES "public"."collections"("collection_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multi_select_options" ADD CONSTRAINT "multi_select_options_field_id_multi_select_fields_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."multi_select_fields"("field_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "single_select_options" ADD CONSTRAINT "single_select_options_field_id_single_select_fields_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."single_select_fields"("field_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_items" ADD CONSTRAINT "page_items_page_ref_id_pages_page_id_fk" FOREIGN KEY ("page_ref_id") REFERENCES "public"."pages"("page_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages_canvas" ADD CONSTRAINT "pages_canvas_project_id_projects_canvas_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects_canvas"("project_id") ON DELETE no action ON UPDATE no action;