import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { PanelNav } from "@/components/panel/panel-nav";

// /panel/* layout. Authenticated users only.
// Login lives at sibling /login (no parent layout, no auth gate).

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PanelNav user={session.user} logout={logout} />
      <main className="flex-1">{children}</main>
      <footer className="py-6 text-center text-xs text-gray-500">
        Panel wspólników · Dekada72H ·{" "}
        <Link href="/" className="text-primary hover:underline">
          ← strona główna
        </Link>
      </footer>
    </div>
  );
}
