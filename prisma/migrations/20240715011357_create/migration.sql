/*
  Warnings:

  - You are about to drop the column `value` on the `products` table. All the data in the column will be lost.
  - Added the required column `idCustomer` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceTotal` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUnity` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCustomer` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `idCustomer` VARCHAR(191) NOT NULL,
    ADD COLUMN `priceTotal` DOUBLE NOT NULL,
    ADD COLUMN `priceUnity` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `favorites` ADD COLUMN `idCustomer` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `value`,
    ADD COLUMN `price` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
