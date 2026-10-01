import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals without per-element JavaScript.
 *
 * These are server components: they only emit markup + CSS variables. A single
 * <RevealObserver /> (mounted in the root layout) adds `.is-revealed` as elements enter the
 * viewport, and CSS in globals.css does the animation. This keeps hydration cheap — dozens of
 * reveals cost one IntersectionObserver instead of dozens of animation components.
 */

type RevealStyle = CSSProperties & { "--reveal-delay"?: string; "--reveal-y"?: string; "--i"?: number };

export function Reveal({
  children,
  delay = 0,
  y,
  className,
}: {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Lift distance in px. */
  y?: number;
  className?: string;
}) {
  const style: RevealStyle = { "--reveal-delay": `${Math.round(delay * 1000)}ms` };
  if (y !== undefined) style["--reveal-y"] = `${y}px`;
  return (
    <div data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Word-by-word masked reveal for headlines.
 * Wrap words in *asterisks* to set them in italic — e.g. "Work that *lasts*."
 * "\n" forces a line break. The full string is exposed once via aria-label.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const plain = text.replace(/\*/g, "").replace(/\n/g, " ");
  const lines = text.split("\n").map(tokenize);
  let wordIndex = 0;

  return (
    <Tag
      id={id}
      aria-label={plain}
      data-reveal-text=""
      className={className}
      style={{ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as RevealStyle}
    >
      <span aria-hidden="true" className="block">
        {lines.map((tokens, li) => (
          <span key={li} className="block">
            {tokens.map((token, ti) => (
              <span key={ti}>
                <span className="rw">
                  <span className={cn(token.italic && "italic")} style={{ "--i": wordIndex++ } as RevealStyle}>
                    {token.word}
                  </span>
                </span>
                {ti < tokens.length - 1 && " "}
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}

function tokenize(line: string) {
  const out: { word: string; italic: boolean }[] = [];
  let italic = false;
  for (const raw of line.split(" ").filter(Boolean)) {
    let word = raw;
    if (word.startsWith("*")) {
      italic = true;
      word = word.slice(1);
    }
    const closes = word.endsWith("*") || /\*[.,!?—]$/.test(word);
    word = word.replace(/\*/g, "");
    out.push({ word, italic });
    if (closes) italic = false;
  }
  return out;
}
