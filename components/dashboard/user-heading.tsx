import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { requireAuth } from "@/lib/auth/requireAdmin";
import { getRandomColorClass } from "@/lib/utils";

export async function UserHeading({
  userSports = [],
}: {
  userSports: string[];
}) {
  const session = await requireAuth();

  if (!session?.alias) return null;

  const sportsList = userSports.length > 0 ? userSports.join(" | ") : "none";

  return (
    <div className="w-full bg-gray-50 p-4 pr-4 rounded-full flex items-center h-16">
      <div className="flex items-center -ml-4">
        <Avatar className="rounded-full w-17 h-17">
          <AvatarImage src={session.image || ""} />
          <AvatarFallback
            className={`bg-emerald-500  text-white flex items-center justify-center h-full w-full text-2xl`}
          >
            {session.alias
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-4">
        <h1 className="text-2xl text-left font-bold">
          {session.alias}
        </h1>
        <p className="text-sm text-gray-600">Your sports: {sportsList}</p>
      </div>
    </div>
  );
}
