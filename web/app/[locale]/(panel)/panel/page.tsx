import type { Metadata } from "next";
import { auth } from "@/auth";
import { Dashboard } from "@/components/panel/dashboard";

export const metadata: Metadata = {
  title: "Dashboard · Panel | Dekada72H",
  robots: { index: false, follow: false },
};

export default async function PanelHome() {
  const session = await auth();
  return <Dashboard user={session!.user} />;
}
