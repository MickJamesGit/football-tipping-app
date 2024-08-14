import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function UserHeading({
  userSports = [],
}: {
  userSports: string[];
}) {
  const session = await auth();

  if (!session?.user?.username) return null;

  const sportsList = userSports.length > 0 ? userSports.join(" | ") : "none";

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg flex items-center">
      <Avatar className="rounded-full  w-16 h-16">
        <AvatarImage src={session.user.image || ""} />
        <AvatarFallback className="bg-gray-400 text-white flex items-center justify-center h-full w-full text-2xl">
          {session.user.username
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h1 className="text-2xl text-left font-bold">
          {session.user.username}
        </h1>
        <p className="text-sm text-gray-600">Your sports: {sportsList}</p>
      </div>
    </div>
  );
}
