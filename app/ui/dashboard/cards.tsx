import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { getTodaysDate } from "@/app/lib/utils";
import {
  fetchPreviousRound,
  fetchRoundTotalUsers,
  fetchUserRankingSummary,
} from "@/app/lib/data";
import { auth, getUser } from "@/auth";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const sport = "NRL";
  const todays_date = getTodaysDate();
  const lastRound = await fetchPreviousRound(todays_date, sport);

  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await getUser(session.user.email);

  const overallRankingSummary = await fetchUserRankingSummary(
    sport,
    "2024",
    user.id,
    "overall"
  );

  const roundRankingSummary = await fetchUserRankingSummary(
    sport,
    "2024",
    user.id,
    lastRound
  );

  const roundTotalUsers = await fetchRoundTotalUsers(sport, lastRound);
  const overallTotalUsers = await fetchRoundTotalUsers(sport, "overall");

  return (
    <>
      {roundRankingSummary !== null ? (
        <>
          <ScoreCard
            title={`Round ${lastRound} score`}
            value={roundRankingSummary.total_points}
            type="collected"
          />
          <RankingCard
            title={`Round ${lastRound} ranking`}
            value={roundRankingSummary.ranking}
            total={roundTotalUsers}
            type="customers"
          />
        </>
      ) : (
        ""
      )}
      {overallRankingSummary !== null ? (
        <>
          <ScoreCard
            title="Overall score"
            value={overallRankingSummary.total_points}
            type="pending"
          />
          <RankingCard
            title="Overall ranking"
            value={overallRankingSummary.ranking}
            total={overallTotalUsers}
            type="invoices"
          />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export function ScoreCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

export function RankingCard({
  title,
  value,
  total,
  type,
}: {
  title: string;
  value: number | string;
  total: number;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value} of {total}
      </p>
    </div>
  );
}
