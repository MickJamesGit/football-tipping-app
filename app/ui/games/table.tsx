import { fetchGames } from "@/app/lib/data";

export default async function GamesTable({
  sport,
  round,
}: {
  sport: string;
  round: number;
}) {
  const games = await fetchGames(sport, round);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <form>
            <div>
              {games?.map((game) => (
                <div
                  key={game.id}
                  className="mb-4 w-full rounded-md bg-white p-4 text-center"
                >
                  <div className="mb-2">
                    <p className="text-xl font-medium">
                      {new Date(game.date).toDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{game.venue}</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center">
                      <div
                        className={`flex-1 p-2 cursor-pointer border bg-gray-300`}
                      >
                        <p>{game.home_team_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex-1 p-2 cursor-pointer border`}>
                        <p>{game.away_team_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Submit Tips
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
