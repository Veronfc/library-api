-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('Fantasy', 'Science Fiction', 'Dysopian', 'Adventure', 'Mystery', 'Horror', 'Thriller', 'Historical Fiction', 'Romance', 'Comtemporary Fiction', 'Autobiography', 'Biography', 'Historical', 'Food & Drink', 'Poetry', 'Travel', 'Art & Photography', 'True Crime', 'Humanaties & Social Sciences', 'Science & Technology');

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borrows" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Borrows_pkey" PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "Borrows" ADD CONSTRAINT "Borrows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrows" ADD CONSTRAINT "Borrows_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
