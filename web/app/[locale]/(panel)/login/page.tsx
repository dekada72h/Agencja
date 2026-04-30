import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import { LoginForm } from "@/components/panel/login-form";

export const metadata: Metadata = {
  title: "Panel · Logowanie | Dekada72H",
  description: "Logowanie do panelu wspólników Dekada72H.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/panel");

  const sp = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/panel",
      });
    } catch (e) {
      // signIn throws NEXT_REDIRECT internally on success — that must propagate.
      // Only AuthError bubbles up here as a real error.
      if (e instanceof Error && e.message?.includes("NEXT_REDIRECT")) throw e;
      // Fall through to ?error=... param via redirect.
      redirect("/panel/login?error=invalid");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden lg:flex bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white p-12 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-secondary/25 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col justify-between w-full">
          <Link href="/" className="font-display font-bold text-xl">
            Dekada<span className="text-gradient-primary">72H</span>
          </Link>
          <div>
            <h1 className="font-display font-bold text-4xl xl:text-5xl leading-tight">
              Panel wspólników
            </h1>
            <p className="mt-4 text-white/70 max-w-md leading-relaxed">
              Zapytania klientów, statystyki strony, ustawienia konta — wszystko
              w jednym miejscu.
            </p>
          </div>
          <div className="text-xs text-white/40">© 2026 Dekada72H</div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <LoginForm action={login} initialError={sp.error} />
      </div>
    </div>
  );
}
