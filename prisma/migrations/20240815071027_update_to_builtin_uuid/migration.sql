/*
  Warnings:

  - A unique constraint covering the columns `[sport,season,round,home_team_id,away_team_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sport,season,round_number]` on the table `rounds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,round,season,sport]` on the table `scores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,round,sport,season]` on the table `scores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `receive_tipping_reminders` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receive_tipping_results` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "competitions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "password_reset_token" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "rounds" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "scores" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tips" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_competitions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "receive_tipping_reminders" SET NOT NULL,
ALTER COLUMN "receive_tipping_results" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification_token" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "unique_game" ON "games"("sport", "season", "round", "home_team_id", "away_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_round" ON "rounds"("sport", "season", "round_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_round_season_sport_unique" ON "scores"("user_id", "round", "season", "sport");

-- CreateIndex
CREATE UNIQUE INDEX "user_round_sport_season_unique" ON "scores"("user_id", "round", "sport", "season");

-- CreateIndex
CREATE UNIQUE INDEX "unique_team_name" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "fk_winning_team" FOREIGN KEY ("winning_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_tip_team_id_fkey" FOREIGN KEY ("tip_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
