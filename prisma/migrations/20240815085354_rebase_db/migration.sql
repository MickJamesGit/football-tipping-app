/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `access_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `competitions` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `competitions` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `competitions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `competitions` table. All the data in the column will be lost.
  - You are about to drop the column `away_team_id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `away_team_score` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `home_team_id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `home_team_score` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `winning_team_id` on the `games` table. All the data in the column will be lost.
  - The `status` column on the `games` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `rounds` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `rounds` table. All the data in the column will be lost.
  - You are about to drop the column `round_number` on the `rounds` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `rounds` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `rounds` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `scores` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `scores` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `scores` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `tip_team_id` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tips` table. All the data in the column will be lost.
  - The `status` column on the `tips` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `receive_tipping_reminders` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `receive_tipping_results` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `password_reset_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_competitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,startDate,endDate]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sport,season,round,homeTeamId,awayTeamId]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sport,season,round]` on the table `rounds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,round,season,sport]` on the table `scores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `awayTeamId` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamId` to the `games` table without a default value. This is not possible if the table is not empty.
  - Made the column `datetime` on table `games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `season` on table `games` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endDate` to the `rounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `rounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `rounds` table without a default value. This is not possible if the table is not empty.
  - Made the column `season` on table `rounds` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SCHEDULED', 'INPROGRESS', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TipStatus" AS ENUM ('PENDING', 'CORRECT', 'INCORRECT');

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "fk_winning_team";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_away_team_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_home_team_id_fkey";

-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tips" DROP CONSTRAINT "tips_game_id_fkey";

-- DropForeignKey
ALTER TABLE "tips" DROP CONSTRAINT "tips_tip_team_id_fkey";

-- DropForeignKey
ALTER TABLE "tips" DROP CONSTRAINT "tips_user_id_fkey";

-- DropIndex
DROP INDEX "unique_game";

-- DropIndex
DROP INDEX "unique_round";

-- DropIndex
DROP INDEX "user_round_season_sport_unique";

-- DropIndex
DROP INDEX "user_round_sport_season_unique";

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiresAt" INTEGER,
ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "sessionState" TEXT,
ADD COLUMN     "tokenType" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "provider" SET DATA TYPE TEXT,
ALTER COLUMN "providerAccountId" SET DATA TYPE TEXT,
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "competitions" DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "away_team_id",
DROP COLUMN "away_team_score",
DROP COLUMN "created_at",
DROP COLUMN "home_team_id",
DROP COLUMN "home_team_score",
DROP COLUMN "updated_at",
DROP COLUMN "winning_team_id",
ADD COLUMN     "awayTeamId" UUID NOT NULL,
ADD COLUMN     "awayTeamScore" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "homeTeamId" UUID NOT NULL,
ADD COLUMN     "homeTeamScore" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "winningTeamId" UUID,
ALTER COLUMN "sport" SET DATA TYPE TEXT,
ALTER COLUMN "round" SET DATA TYPE TEXT,
ALTER COLUMN "venue" SET DATA TYPE TEXT,
ALTER COLUMN "datetime" SET NOT NULL,
ALTER COLUMN "datetime" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "season" SET NOT NULL,
ALTER COLUMN "season" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "GameStatus" DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "rounds" DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "round_number",
DROP COLUMN "start_date",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "round" TEXT NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "sport" SET DATA TYPE TEXT,
ALTER COLUMN "season" SET NOT NULL,
ALTER COLUMN "season" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "scores" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "sport" SET DATA TYPE TEXT,
ALTER COLUMN "season" SET DATA TYPE TEXT,
ALTER COLUMN "round" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires",
ADD COLUMN     "expiresAt" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "sessionToken" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "sport" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tips" DROP COLUMN "created_at",
DROP COLUMN "game_id",
DROP COLUMN "tip_team_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gameId" UUID NOT NULL,
ADD COLUMN     "teamId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TipStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "receive_tipping_reminders",
DROP COLUMN "receive_tipping_results",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receiveTippingReminders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiveTippingResults" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "alias" SET DATA TYPE TEXT,
ALTER COLUMN "emailVerified" SET DATA TYPE TIMESTAMPTZ(3);

-- DropTable
DROP TABLE "password_reset_token";

-- DropTable
DROP TABLE "user_competitions";

-- DropTable
DROP TABLE "verification_token";

-- CreateTable
CREATE TABLE "passwordResetTokens" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "passwordResetTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCompetitions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "competitionId" UUID NOT NULL,
    "signupDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userCompetitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationTokens" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verificationTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "passwordResetTokens_email_idx" ON "passwordResetTokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passwordResetTokens_token_key" ON "passwordResetTokens"("token");

-- CreateIndex
CREATE INDEX "userCompetitions_userId_idx" ON "userCompetitions"("userId");

-- CreateIndex
CREATE INDEX "userCompetitions_competitionId_idx" ON "userCompetitions"("competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "userCompetitions_userId_competitionId_key" ON "userCompetitions"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "verificationTokens_token_key" ON "verificationTokens"("token");

-- CreateIndex
CREATE INDEX "verificationTokens_expires_idx" ON "verificationTokens"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "competitions_startDate_idx" ON "competitions"("startDate");

-- CreateIndex
CREATE INDEX "competitions_endDate_idx" ON "competitions"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "competitions_name_startDate_endDate_key" ON "competitions"("name", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "games_datetime_idx" ON "games"("datetime");

-- CreateIndex
CREATE UNIQUE INDEX "unique_game" ON "games"("sport", "season", "round", "homeTeamId", "awayTeamId");

-- CreateIndex
CREATE INDEX "rounds_sport_season_idx" ON "rounds"("sport", "season");

-- CreateIndex
CREATE UNIQUE INDEX "unique_round" ON "rounds"("sport", "season", "round");

-- CreateIndex
CREATE INDEX "scores_userId_sport_season_round_idx" ON "scores"("userId", "sport", "season", "round");

-- CreateIndex
CREATE UNIQUE INDEX "user_round_season_sport_unique" ON "scores"("userId", "round", "season", "sport");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_sessionToken_idx" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "teams_name_idx" ON "teams"("name");

-- CreateIndex
CREATE INDEX "teams_sport_idx" ON "teams"("sport");

-- CreateIndex
CREATE INDEX "tips_userId_idx" ON "tips"("userId");

-- CreateIndex
CREATE INDEX "tips_teamId_idx" ON "tips"("teamId");

-- CreateIndex
CREATE INDEX "tips_gameId_idx" ON "tips"("gameId");

-- CreateIndex
CREATE INDEX "tips_userId_gameId_idx" ON "tips"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winningTeamId_fkey" FOREIGN KEY ("winningTeamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userCompetitions" ADD CONSTRAINT "userCompetitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompetitions" ADD CONSTRAINT "userCompetitions_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
