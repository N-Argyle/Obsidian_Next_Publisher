ALTER TABLE "docs" ADD COLUMN "uuid" text;--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_uuid_unique" UNIQUE("uuid");