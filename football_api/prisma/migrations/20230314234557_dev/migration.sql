/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `teamId` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Coach` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Coach` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `teamId` on the `Coach` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Competition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Competition` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `coachId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `competitionId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "teamId" INTEGER,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("dateOfBirth", "id", "name", "nationality", "position", "teamId") SELECT "dateOfBirth", "id", "name", "nationality", "position", "teamId" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE TABLE "new_Coach" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "nationality" TEXT,
    "teamId" INTEGER,
    CONSTRAINT "Coach_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Coach" ("dateOfBirth", "id", "name", "nationality", "teamId") SELECT "dateOfBirth", "id", "name", "nationality", "teamId" FROM "Coach";
DROP TABLE "Coach";
ALTER TABLE "new_Coach" RENAME TO "Coach";
CREATE UNIQUE INDEX "Coach_teamId_key" ON "Coach"("teamId");
CREATE TABLE "new_Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "areaName" TEXT NOT NULL
);
INSERT INTO "new_Competition" ("areaName", "code", "id", "name") SELECT "areaName", "code", "id", "name" FROM "Competition";
DROP TABLE "Competition";
ALTER TABLE "new_Competition" RENAME TO "Competition";
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tla" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "address" TEXT,
    "competitionId" INTEGER,
    "coachId" INTEGER,
    CONSTRAINT "Team_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("address", "areaName", "coachId", "competitionId", "id", "name", "shortName", "tla") SELECT "address", "areaName", "coachId", "competitionId", "id", "name", "shortName", "tla" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
