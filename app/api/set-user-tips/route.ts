import { setNewUserTips, updateGameStatuses } from "@/app/lib/actions";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await setNewUserTips("fa1a5fb4-0f10-401c-a998-525707837d57", "NRL", "2024");
  return NextResponse.json({ message: "Users tips created" });
}
