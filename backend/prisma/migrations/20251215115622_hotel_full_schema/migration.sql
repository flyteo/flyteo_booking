/*
  Warnings:

  - You are about to drop the column `hotelAdminId` on the `hotel` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hotel` DROP FOREIGN KEY `Hotel_hotelAdminId_fkey`;

-- AlterTable
ALTER TABLE `hotel` DROP COLUMN `hotelAdminId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `hotelId` INTEGER NULL,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
