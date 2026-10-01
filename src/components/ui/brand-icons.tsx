import type { SVGProps } from "react";

/**
 * Brand glyphs drawn in Lucide's visual language (24px grid, 2px stroke, round joins).
 * Lucide v1 removed brand icons, so these keep the icon set consistent.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.6 6.4h.01" />
    </Svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21.5 3.5 2.8 10.7c-.9.35-.85 1.64.07 1.93l4.63 1.47 1.8 5.5c.24.73 1.16.95 1.7.4l2.57-2.56 4.63 3.4c.63.46 1.53.12 1.7-.64L22.8 4.8c.2-.9-.64-1.63-1.3-1.3Z" />
      <path d="m7.5 14.1 9.3-6.1-6.7 7.2" />
    </Svg>
  );
}
