CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
