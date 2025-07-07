CREATE TABLE "verification_token" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_id_token_pk" PRIMARY KEY("id","token")
);
