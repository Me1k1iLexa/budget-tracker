/*
  Warnings:

  - You are about to drop the column `end_date` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Budget` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "limit_amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget" ("id", "limit_amount", "userId") SELECT "id", "limit_amount", "userId" FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
