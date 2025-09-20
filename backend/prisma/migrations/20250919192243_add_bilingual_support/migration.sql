/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantDescription` on the `menu_config` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantName` on the `menu_config` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product_variations` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `nameAr` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameAr` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `product_variations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameAr` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_name_idx";

-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "products_name_idx";

-- AlterTable - Add new bilingual columns first
ALTER TABLE "categories" 
ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- Populate new columns with existing data
UPDATE "categories" SET 
"nameEn" = "name",
"nameAr" = "name",
"descriptionEn" = "description", 
"descriptionAr" = "description";

-- Make new columns required
ALTER TABLE "categories" ALTER COLUMN "nameAr" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "nameEn" SET NOT NULL;

-- Drop old columns
ALTER TABLE "categories" DROP COLUMN "description", DROP COLUMN "name";

-- AlterTable
ALTER TABLE "menu_config" DROP COLUMN "restaurantDescription",
DROP COLUMN "restaurantName",
ADD COLUMN     "defaultLanguage" TEXT NOT NULL DEFAULT 'ar',
ADD COLUMN     "restaurantDescriptionAr" TEXT,
ADD COLUMN     "restaurantDescriptionEn" TEXT,
ADD COLUMN     "restaurantNameAr" TEXT NOT NULL DEFAULT 'سرايا للمشروبات',
ADD COLUMN     "restaurantNameEn" TEXT NOT NULL DEFAULT 'Saraya Drinks';

-- AlterTable - Add new bilingual columns for product variations
ALTER TABLE "product_variations" 
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- Populate new columns with existing data and Arabic translations
UPDATE "product_variations" SET 
"nameEn" = "name",
"nameAr" = CASE 
  WHEN "name" = 'Small' THEN 'صغير'
  WHEN "name" = 'Medium' THEN 'متوسط'
  WHEN "name" = 'Large' THEN 'كبير'
  WHEN "name" = 'Hot' THEN 'ساخن'
  WHEN "name" = 'Iced' THEN 'مثلج'
  WHEN "name" = 'No Sugar' THEN 'بدون سكر'
  WHEN "name" = 'Light Sweet' THEN 'سكر خفيف'
  WHEN "name" = 'Regular Sweet' THEN 'سكر عادي'
  WHEN "name" = 'Extra Sweet' THEN 'سكر زيادة'
  ELSE "name"
END;

-- Make new columns required
ALTER TABLE "product_variations" ALTER COLUMN "nameAr" SET NOT NULL;
ALTER TABLE "product_variations" ALTER COLUMN "nameEn" SET NOT NULL;

-- Drop old column
ALTER TABLE "product_variations" DROP COLUMN "name";

-- AlterTable - Add new bilingual columns for products
ALTER TABLE "products" 
ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "ingredientsAr" TEXT,
ADD COLUMN     "ingredientsEn" TEXT,
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "nameEn" TEXT;

-- Populate new columns with existing data
UPDATE "products" SET 
"nameEn" = "name",
"nameAr" = "name",
"descriptionEn" = "description",
"descriptionAr" = "description",
"ingredientsEn" = "ingredients",
"ingredientsAr" = "ingredients";

-- Make new columns required
ALTER TABLE "products" ALTER COLUMN "nameAr" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "nameEn" SET NOT NULL;

-- Drop old columns
ALTER TABLE "products" DROP COLUMN "description", DROP COLUMN "ingredients", DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "categories_nameEn_idx" ON "categories"("nameEn");

-- CreateIndex
CREATE INDEX "categories_nameAr_idx" ON "categories"("nameAr");

-- CreateIndex
CREATE INDEX "products_nameEn_idx" ON "products"("nameEn");

-- CreateIndex
CREATE INDEX "products_nameAr_idx" ON "products"("nameAr");
