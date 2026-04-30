import { CursorProvider } from "@/components/schwenk/cursor-context";
import { SmoothCursor } from "@/components/schwenk/smooth-cursor";
import { ScrollProgress } from "@/components/schwenk/scroll-progress";
import { Grain } from "@/components/schwenk/grain";
import { SchwenkNav } from "@/components/schwenk/schwenk-nav";
import { SchwenkFooter } from "@/components/schwenk/schwenk-footer";
import { PortfolioBanner } from "@/components/schwenk/portfolio-banner";
import { PageTransition } from "@/components/schwenk/page-transition";

export default function SchwenkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CursorProvider>
      <div className="schwenk-theme min-h-screen flex flex-col">
        <ScrollProgress />
        <Grain opacity={0.04} />
        <SmoothCursor />
        <SchwenkNav />
        <main className="flex-1 relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <SchwenkFooter />
        <PortfolioBanner />
      </div>
    </CursorProvider>
  );
}
