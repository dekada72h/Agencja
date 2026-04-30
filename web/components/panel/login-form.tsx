"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export function LoginForm({
  action,
  initialError,
}: {
  action: (data: FormData) => Promise<void>;
  initialError?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError);

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      action={async (fd) => {
        setError(undefined);
        setPending(true);
        try {
          await action(fd);
        } catch (e) {
          // server action throws NEXT_REDIRECT on success — normal
          if (!(e instanceof Error && e.message.includes("NEXT_REDIRECT"))) {
            setError("invalid");
          }
        } finally {
          setPending(false);
        }
      }}
      className="w-full max-w-sm space-y-5"
    >
      <div>
        <h2 className="font-display font-bold text-2xl text-ink">Zaloguj się</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tylko dla wspólników Dekada72H.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-medium text-gray-700">
          Hasło
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            Niepoprawny email lub hasło.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={pending}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-3.5 rounded-full bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow disabled:opacity-60 disabled:cursor-wait transition-shadow"
      >
        {pending ? "Logowanie…" : "Zaloguj się"}
      </motion.button>

      <div className="text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-primary transition-colors"
        >
          ← powrót do strony głównej
        </Link>
      </div>
    </motion.form>
  );
}
