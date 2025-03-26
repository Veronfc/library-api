/*
  Warnings:

  - You are about to drop the `Borrows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Borrows" DROP CONSTRAINT "Borrows_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Borrows" DROP CONSTRAINT "Borrows_userId_fkey";

-- DropTable
DROP TABLE "Borrows";

-- CreateTable
CREATE TABLE "Borrow" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Borrow_pkey" PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
