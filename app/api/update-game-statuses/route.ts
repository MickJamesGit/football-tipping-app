import { updateGameStatuses } from "@/app/lib/actions";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await updateGameStatuses();
  return NextResponse.json({ message: "Game statuses updated successfully." });
}
