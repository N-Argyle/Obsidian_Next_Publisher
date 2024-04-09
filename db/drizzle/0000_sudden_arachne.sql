CREATE TABLE IF NOT EXISTS "docs" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"path" text,
	"title" text,
	"updated" timestamp DEFAULT now()
);
