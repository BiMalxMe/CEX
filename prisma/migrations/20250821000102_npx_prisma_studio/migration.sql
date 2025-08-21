/*
  Warnings:

  - You are about to drop the column `nprWalletid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `solWalletId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('Google');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "nprWalletid",
DROP COLUMN "solWalletId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "provider" "public"."Provider" NOT NULL;
