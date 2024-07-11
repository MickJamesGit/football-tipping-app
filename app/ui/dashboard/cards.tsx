import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { getTodaysDate } from "@/app/lib/utils";
import { fetchPreviousRound, fetchUserRankingSummary } from "@/app/lib/data";
import { getUser } from "@/auth";

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

  const email = "user1@nextmail.com";
  const user = await getUser(email);

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

  return (
    <>
      {roundRankingSummary !== null ? (
        <>
          <Card
            title={`Round ${lastRound} score`}
            value={roundRankingSummary.total_points}
            type="collected"
          />
          <Card
            title={`Round ${lastRound} ranking`}
            value={roundRankingSummary.ranking}
            type="customers"
          />
        </>
      ) : (
        ""
      )}
      {overallRankingSummary !== null ? (
        <>
          <Card
            title="Overall score"
            value={overallRankingSummary.total_points}
            type="pending"
          />
          <Card
            title="Overall ranking"
            value={overallRankingSummary.ranking}
            type="invoices"
          />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export function Card({
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
