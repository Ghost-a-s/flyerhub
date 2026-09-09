CREATE TYPE "public"."access_tier" AS ENUM('FREE', 'PREMIUM');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('FREE', 'PRO', 'CREATOR');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('ACTIVE', 'CANCELED', 'PAST_DUE', 'EXPIRED');--> statement-breakpoint
CREATE TABLE "collection_item" (
	"collection_id" text NOT NULL,
	"content_item_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_item_collection_id_content_item_id_pk" PRIMARY KEY("collection_id","content_item_id")
);
--> statement-breakpoint
CREATE TABLE "collection" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan" "subscription_plan" DEFAULT 'FREE' NOT NULL,
	"status" "subscription_status" DEFAULT 'ACTIVE' NOT NULL,
	"provider" text,
	"provider_subscription_id" text,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_provider_subscription_id_unique" UNIQUE("provider_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "access_tier" "access_tier" DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "price_minor" integer;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "currency" text DEFAULT 'GHS' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "file_size_bytes" integer;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "resolution" text;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "color_mode" text;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "orientation" text;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "smart_objects" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "editable_text" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "content_item" ADD COLUMN "print_ready" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "creator_bio" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "creator_display_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_creator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "follower_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_content_item_id_content_item_id_fk" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection" ADD CONSTRAINT "collection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collection_user_idx" ON "collection" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_user_idx" ON "subscription" USING btree ("user_id","status");