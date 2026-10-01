import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { About } from "@/components/about/about";
import { Contact } from "@/components/contact/contact";
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
    </>
  );
}
