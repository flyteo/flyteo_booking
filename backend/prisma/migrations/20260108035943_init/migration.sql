/*
  Warnings:

  - You are about to drop the column `price` on the `booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `price`,
    ADD COLUMN `advancePercent` INTEGER NULL,
    ADD COLUMN `fullname` VARCHAR(255) NULL,
    ADD COLUMN `mobileno` VARCHAR(20) NOT NULL,
    ADD COLUMN `paidAmount` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `paymentType` VARCHAR(20) NULL DEFAULT 'full',
    ADD COLUMN `remainingAmount` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `roomCount` INTEGER NULL DEFAULT 1,
    ADD COLUMN `totalAmount` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `villaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `camping` ADD COLUMN `advancePaymentAllowed` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `advancePercent` INTEGER NULL;

-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `hotel` ADD COLUMN `advancePaymentAllowed` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `advancePercent` INTEGER NULL,
    ADD COLUMN `taxes` FLOAT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `offer` ADD COLUMN `image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `mobileNo` VARCHAR(20) NULL;

-- CreateTable
CREATE TABLE `villa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NULL,
    `mapLocation` VARCHAR(255) NULL,
    `maxGuests` INTEGER NOT NULL,
    `includedGuests` INTEGER NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `discount` INTEGER NULL DEFAULT 0,
    `extraGuestPrice` DECIMAL(10, 2) NOT NULL,
    `checkInTime` VARCHAR(50) NULL,
    `checkOutTime` VARCHAR(50) NULL,
    `cancellationPolicy` TEXT NULL,
    `securityDeposit` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `advancePaymentAllowed` BOOLEAN NULL DEFAULT false,
    `advancePercent` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villaimage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `villaId` INTEGER NOT NULL,
    `url` TEXT NOT NULL,

    INDEX `villaId`(`villaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villalayout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `villaId` INTEGER NOT NULL,
    `bedrooms` INTEGER NOT NULL,
    `bathrooms` INTEGER NOT NULL,
    `beds` INTEGER NOT NULL,
    `livingRoom` BOOLEAN NULL DEFAULT true,
    `kitchen` BOOLEAN NULL DEFAULT true,
    `privatePool` BOOLEAN NULL DEFAULT false,
    `garden` BOOLEAN NULL DEFAULT false,
    `parkingSlots` INTEGER NULL,
    `extraNotes` TEXT NULL,

    UNIQUE INDEX `villaId`(`villaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `hotelId` INTEGER NULL,
    `campingId` INTEGER NULL,
    `villaId` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_review_camping`(`campingId`),
    INDEX `fk_review_hotel`(`hotelId`),
    INDEX `fk_review_user`(`userId`),
    INDEX `fk_review_villa`(`villaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villaamenity` (
    `villaId` INTEGER NOT NULL,
    `amenityId` INTEGER NOT NULL,

    INDEX `fk_villaamenity_amenity`(`amenityId`),
    PRIMARY KEY (`villaId`, `amenityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villacoupon` (
    `villaId` INTEGER NOT NULL,
    `couponId` INTEGER NOT NULL,

    INDEX `fk_villacoupon_coupon`(`couponId`),
    PRIMARY KEY (`villaId`, `couponId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villaoffer` (
    `villaId` INTEGER NOT NULL,
    `offerId` INTEGER NOT NULL,

    INDEX `fk_villaoffer_offer`(`offerId`),
    PRIMARY KEY (`villaId`, `offerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactmessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mobileNo` VARCHAR(20) NULL,
    `subject` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `isResolved` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_contact_email`(`email`),
    INDEX `idx_contact_resolved`(`isResolved`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_booking_villaId` ON `booking`(`villaId`);

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `fk_booking_villa` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villaimage` ADD CONSTRAINT `villaimage_ibfk_1` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villalayout` ADD CONSTRAINT `villalayout_ibfk_1` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_review_camping` FOREIGN KEY (`campingId`) REFERENCES `camping`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_review_hotel` FOREIGN KEY (`hotelId`) REFERENCES `hotel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_review_villa` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villaamenity` ADD CONSTRAINT `fk_villaamenity_amenity` FOREIGN KEY (`amenityId`) REFERENCES `amenity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villaamenity` ADD CONSTRAINT `fk_villaamenity_villa` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villacoupon` ADD CONSTRAINT `fk_villacoupon_coupon` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villacoupon` ADD CONSTRAINT `fk_villacoupon_villa` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villaoffer` ADD CONSTRAINT `fk_villaoffer_offer` FOREIGN KEY (`offerId`) REFERENCES `offer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `villaoffer` ADD CONSTRAINT `fk_villaoffer_villa` FOREIGN KEY (`villaId`) REFERENCES `villa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
