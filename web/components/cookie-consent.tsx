"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "dekada72h.cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    // GA loading wired up in Batch 2 when we port the analytics integration
  };
  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
          className="fixed bottom-4 inset-x-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 rounded-2xl bg-white/95 backdrop-blur-md shadow-glow border border-gray-100 p-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="text-sm text-gray-700 leading-relaxed">
            Używamy plików cookie do analityki i ulepszania strony. Akceptując,
            zgadzasz się na ich użycie zgodnie z polityką prywatności.
          </p>
          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={decline}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-ink"
            >
              Odrzuć
            </button>
            <button
              type="button"
              onClick={accept}
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-primary text-white shadow-soft hover:shadow-glow transition-shadow"
            >
              Akceptuję
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
