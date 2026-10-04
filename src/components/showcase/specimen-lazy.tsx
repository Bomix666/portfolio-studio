"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * The specimen is the heaviest interactive tree on the page. It's code-split and only mounted
 * when the visitor is about a viewport away, so it costs nothing at load. The skeleton mirrors
 * the final layout's dimensions to avoid layout shift.
 */
const Specimen = dynamic(() => import("./specimen").then((m) => m.Specimen), {
  ssr: false,
  loading: () => <SpecimenSkeleton />,
});

export function SpecimenLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? <Specimen /> : <SpecimenSkeleton />}</div>;
}

function SpecimenSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
      <div className="min-w-0 lg:col-span-4">
        <div className="flex gap-2 overflow-hidden lg:flex-col lg:gap-0 lg:border-t lg:border-line">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="h-11 w-32 shrink-0 rounded-full border border-line lg:h-[4.125rem] lg:w-auto lg:rounded-none lg:border-0 lg:border-b"
            />
          ))}
        </div>
      </div>
      <div className="min-w-0 lg:col-span-8">
        <div className="overflow-hidden rounded-plate bg-ink-2 ring-1 ring-white/10">
          <div className="h-[3.75rem] border-b border-line" />
          <div className="p-4 md:p-6">
            <div className="h-[26rem] animate-pulse rounded-[14px] bg-white/[0.03] sm:h-[30rem] lg:h-[34rem]" />
          </div>
          <div className="min-h-[17rem] border-t border-line" />
        </div>
      </div>
    </div>
  );
}
