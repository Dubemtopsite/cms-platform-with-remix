-- CreateTable
CREATE TABLE "PlatformUser" (
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "supabaseUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformUser_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "PlatformCategory" (
    "id" UUID NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformArticle" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_email_key" ON "PlatformUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformArticle_slug_key" ON "PlatformArticle"("slug");

-- AddForeignKey
ALTER TABLE "PlatformArticle" ADD CONSTRAINT "PlatformArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PlatformCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformArticle" ADD CONSTRAINT "PlatformArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
