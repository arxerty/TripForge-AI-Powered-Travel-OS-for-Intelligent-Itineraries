import { promises as fs } from "fs";
import path from "path";
import type { StoredTrip } from "./types";

// File-backed trip store. It keeps TripForge usable without a running
// PostgreSQL instance; swap these functions for Prisma calls once the DB is up.
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "trips.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<StoredTrip[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8")) as StoredTrip[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(trips: StoredTrip[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(trips, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/** Serialises read-modify-write cycles so concurrent requests don't clobber each other. */
function mutate<T>(fn: (trips: StoredTrip[]) => { trips: StoredTrip[]; result: T }): Promise<T> {
  const run = writeQueue.then(async () => {
    const { trips, result } = fn(await readAll());
    await writeAll(trips);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function listTrips(ownerId: string | null) {
  if (!ownerId) return [];
  const trips = await readAll();
  return trips
    .filter((t) => t.ownerId === ownerId)
    .sort((a, b) => a.input.startDate.localeCompare(b.input.startDate));
}

export async function getTrip(id: string, ownerId: string | null) {
  if (!ownerId) return null;
  const trips = await readAll();
  return trips.find((t) => t.id === id && t.ownerId === ownerId) ?? null;
}

export function saveTrip(trip: StoredTrip) {
  return mutate((trips) => ({ trips: [...trips, trip], result: trip }));
}

export function deleteTrip(id: string, ownerId: string) {
  return mutate((trips) => {
    const next = trips.filter((t) => !(t.id === id && t.ownerId === ownerId));
    return { trips: next, result: next.length !== trips.length };
  });
}
