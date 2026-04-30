// Root layout is a pass-through; the real <html>/<body> shell lives in
// app/[locale]/layout.tsx so next-intl can set the lang attribute correctly.
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
