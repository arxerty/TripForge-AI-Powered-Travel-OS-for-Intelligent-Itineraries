import { NextResponse } from "next/server";
import { getOwnerId } from "@/lib/trips/owner";
import { deleteTrip } from "@/lib/trips/store";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const [{ id }, ownerId] = await Promise.all([params, getOwnerId()]);
  if (!ownerId || !(await deleteTrip(id, ownerId))) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
