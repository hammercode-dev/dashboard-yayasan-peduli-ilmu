-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_evidences" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "full_name" TEXT,
    "evidence_url" TEXT,
    "program_id" BIGINT,
    "phone_number" TEXT,
    "email" TEXT,
    "amount" DECIMAL,
    "payment_method" TEXT,
    "description" TEXT,
    "updated_at" TIMESTAMPTZ(6),
    "donation_upload_at" TIMESTAMPTZ(6),

    CONSTRAINT "donation_evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "username" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "address" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_donation" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "target_amount" DECIMAL,
    "collected_amount" DECIMAL,
    "status" TEXT,
    "starts_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMPTZ(6),
    "location" TEXT,
    "slug" TEXT,
    "short_description" TEXT,
    "title_en" TEXT,
    "description_en" TEXT,
    "short_description_en" TEXT,
    "title_ar" TEXT,
    "description_ar" TEXT,
    "short_description_ar" TEXT,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_timeline" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE,
    "activity" TEXT,
    "activity_en" TEXT,
    "activity_ar" TEXT,
    "cost" DECIMAL,
    "description" TEXT,
    "program_id" BIGINT,

    CONSTRAINT "program_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donation_evidences_id_key" ON "donation_evidences"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "programs_title_key" ON "program_donation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "program_donation_slug_key" ON "program_donation"("slug");

-- AddForeignKey
ALTER TABLE "donation_evidences" ADD CONSTRAINT "donation_evidences_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program_donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "program_timeline" ADD CONSTRAINT "program_timeline_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program_donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
