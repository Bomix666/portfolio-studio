import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { About } from "@/components/about/about";
import { Contact } from "@/components/contact/contact";
import { Disciplines } from "@/components/disciplines/disciplines";
import { Hero } from "@/components/hero/hero";
import { Process } from "@/components/process/process";
import { Services } from "@/components/services/services";
import { Showcase } from "@/components/showcase/showcase";
import { Stack } from "@/components/stack/stack";
import { Work } from "@/components/work/work";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Each section below the hero sits in its own Suspense boundary. Nothing suspends — the page is
 * fully static — but React hydrates every boundary as a separate unit of work and yields to the
 * browser in between, turning one long hydration task into several short ones (better TBT/INP).
 */
function Island({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      {/*
        The rest of the page is one sheet that slides over the pinned hero: pulled up by a screen
        (the hero track is two screens tall), rounded at the top, lit by a hairline on its edge.
        `overflow-clip` rounds the first section without breaking the sticky stages inside.
      */}
      <div className="relative z-10 bg-ink pin:-mt-[100svh] pin:overflow-clip pin:rounded-t-plate pin:shadow-[0_-1px_0_rgb(255_255_255/0.14),0_-28px_70px_rgb(0_0_0/0.75)]">
        <Island>
          <About />
        </Island>
        <Island>
          <Work />
        </Island>
        <Island>
          <Showcase />
        </Island>
        <Island>
          <Disciplines />
        </Island>
        <Island>
          <Services />
        </Island>
        <Island>
          <Process />
        </Island>
        <Island>
          <Stack />
        </Island>
        <Island>
          <Contact />
        </Island>
      </div>
    </>
  );
}
