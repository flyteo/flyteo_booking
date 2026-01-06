/*
  Warnings:

  - You are about to drop the column `price` on the `campingpricing` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `offer` table. All the data in the column will be lost.
  - Added the required column `adultPrice` to the `CampingPricing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childPrice` to the `CampingPricing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `campingpricing` DROP COLUMN `price`,
    ADD COLUMN `adultPrice` DOUBLE NOT NULL,
    ADD COLUMN `childPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `coupon` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `offer` DROP COLUMN `updatedAt`;

ALTER TABLE `camping` DROP COLUMN `defaultPrice`;