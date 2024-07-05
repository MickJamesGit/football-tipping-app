import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function Page({}) {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <h1 className={`${lusitana.className} text-2xl text-left`}>
          Leaderboard
        </h1>
      </div>
    </div>
  );
}
