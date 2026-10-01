/** Join class names, skipping falsy values. (No tailwind-merge: we don't compose conflicting utilities.) */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
