import { promises as fs } from "node:fs";
import path from "node:path";
import { compare } from "bcryptjs";

// Partner panel users.
// Source of truth is `web/data/partners.json` (or DEKADA_PARTNERS_PATH env override).
// The file is mounted into the Docker container as a read-only volume so
// credentials live OUTSIDE the image — easy to rotate without rebuilding.
//
// Structure (JSON file):
//   [
//     {
//       "email": "damian@dekada72h.com",
//       "password_hash": "$2a$10$...",     // bcrypt
//       "name": "Damian Zieliński",
//       "role": "owner"                     // owner | partner
//     },
//     ...
//   ]
//
// Generate hashes locally with:
//   node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"

export type Partner = {
  email: string;
  password_hash: string;
  name: string;
  role: "owner" | "partner";
};

const FILE = process.env.DEKADA_PARTNERS_PATH
  ?? path.join(process.cwd(), "data", "partners.json");

let cache: Partner[] | null = null;
let cacheStamp = 0;
const TTL_MS = 5_000; // re-read at most every 5s — ops can edit JSON without restart

export async function loadPartners(): Promise<Partner[]> {
  const now = Date.now();
  if (cache && now - cacheStamp < TTL_MS) return cache;
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    cache = JSON.parse(raw) as Partner[];
    cacheStamp = now;
    return cache;
  } catch (e) {
    console.warn("[panel] partners.json missing or invalid:", String(e));
    return [];
  }
}

export async function verifyPartner(
  email: string,
  password: string,
): Promise<Omit<Partner, "password_hash"> | null> {
  const partners = await loadPartners();
  const p = partners.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!p) return null;
  const ok = await compare(password, p.password_hash);
  if (!ok) return null;
  return { email: p.email, name: p.name, role: p.role };
}
