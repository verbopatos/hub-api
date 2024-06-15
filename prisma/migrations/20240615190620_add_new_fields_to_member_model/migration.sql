/*
  Warnings:

  - Added the required column `city` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Members" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
