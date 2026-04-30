// Server-side index for MDX custom components. NOT a "use client" file —
// individual components below are client components imported from their
// own modules.

import { StatHighlight, Stat } from "./mdx/stat-highlight";
import { Callout } from "./mdx/callout";
import { CtaBox } from "./mdx/cta-box";

export { StatHighlight, Stat, Callout, CtaBox };

export const mdxComponents = {
  StatHighlight,
  Stat,
  Callout,
  CtaBox,
};
