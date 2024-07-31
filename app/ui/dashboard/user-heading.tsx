import { Avatar } from "@mui/material";
import { auth } from "@/auth";

export async function UserHeading({ userSports }: { userSports: string[] }) {
  const session = await auth();

  if (!session?.user?.image || !session.user.username) return null;

  const sportsList = userSports.length > 0 ? userSports.join(" | ") : "none";

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg flex items-center">
      <Avatar src={session.user.image} alt={session.user.username} />
      <div className="ml-4">
        <h1 className="text-2xl text-left font-bold">
          {session.user.username}
        </h1>
        <p className="text-sm text-gray-600">Your sports: {sportsList}</p>
      </div>
    </div>
  );
}
