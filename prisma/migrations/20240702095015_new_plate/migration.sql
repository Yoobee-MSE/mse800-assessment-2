/*
  Warnings:

  - You are about to drop the column `quantity` on the `cars` table. All the data in the column will be lost.
  - Added the required column `plate_number` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "quantity",
ADD COLUMN     "plate_number" TEXT NOT NULL;
