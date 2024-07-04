import Image from "next/image";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
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
          <div className="md:hidden">
            {games?.map((game) => (
              <div
                key={game.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{game.home_team_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {game.away_team_name}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{game.venue}</p>
                    <p>{new Date(game.date).toDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Home Team
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Away Team
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Venue
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {games?.map((game) => (
                <tr
                  key={game.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {game.home_team_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.away_team_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{game.venue}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(game.date).toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
