/*
  Warnings:

  - You are about to drop the column `imgId` on the `Food` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `FoodType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[foodId]` on the table `Img` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foodId` to the `Img` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_imgId_fkey";

-- DropForeignKey
ALTER TABLE "OrderFood" DROP CONSTRAINT "OrderFood_orderId_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "imgId";

-- AlterTable
ALTER TABLE "Img" ADD COLUMN     "foodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "status",
ADD COLUMN     "change" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "payMethod" TEXT NOT NULL DEFAULT 'cash',
ADD COLUMN     "payStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "prepareStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "receiveMoney" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shopId" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderFood" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FoodType_name_key" ON "FoodType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Img_foodId_key" ON "Img"("foodId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFood" ADD CONSTRAINT "OrderFood_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Img" ADD CONSTRAINT "Img_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
