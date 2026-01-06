-- CreateTable
CREATE TABLE `Camping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `defaultPrice` DOUBLE NOT NULL DEFAULT 999,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingInclusion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingExclusion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingItinerary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingItineraryPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itineraryId` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampingPricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campingId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,

    UNIQUE INDEX `CampingPricing_campingId_day_key`(`campingId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CampingImage` ADD CONSTRAINT `CampingImage_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingInclusion` ADD CONSTRAINT `CampingInclusion_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingExclusion` ADD CONSTRAINT `CampingExclusion_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingActivity` ADD CONSTRAINT `CampingActivity_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingItinerary` ADD CONSTRAINT `CampingItinerary_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingItineraryPoint` ADD CONSTRAINT `CampingItineraryPoint_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `CampingItinerary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CampingPricing` ADD CONSTRAINT `CampingPricing_campingId_fkey` FOREIGN KEY (`campingId`) REFERENCES `Camping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
