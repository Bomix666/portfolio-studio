"use client";

import { CircleAlert } from "lucide-react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className={cn("mt-2 flex items-start gap-1.5 text-sm text-danger", !message && "sr-only")} aria-live="polite">
      {message && <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />}
      {message}
    </p>
  );
}

function FieldLabel({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="label flex items-center justify-between text-fg-subtle">
      <span>
        {children}
        {!optional && (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </span>
      {optional && <span className="normal-case tracking-normal text-fg-subtle/80">Необязательно</span>}
    </label>
  );
}

const control =
  "mt-2 block w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-fg placeholder:text-fg-subtle/60 transition-colors duration-300 focus:outline-none focus-visible:outline-none";

function controlState(error?: string) {
  // Focus: the underline thickens (inset shadow) and brightens — visible without a layout shift.
  return error
    ? "border-danger focus:border-danger focus:shadow-[0_1px_0_0_var(--color-danger)]"
    : "border-line-strong hover:border-fg/40 focus:border-accent focus:shadow-[0_1px_0_0_var(--color-accent)]";
}

export function TextField({
  id,
  label,
  error,
  optional,
  onValue,
  inputRef,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  onValue: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onChange">) {
  const errorId = `${id}-error`;
  return (
    <div>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        ref={inputRef}
        id={id}
        name={id}
        required={!optional}
        aria-required={!optional}
        aria-invalid={!!error}
        aria-describedby={errorId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onValue(e.target.value)}
        className={cn(control, controlState(error))}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  onValue,
  inputRef,
  hint,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  onValue: (value: string) => void;
  inputRef?: Ref<HTMLTextAreaElement>;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "onChange">) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        ref={inputRef}
        id={id}
        name={id}
        required
        aria-required
        aria-invalid={!!error}
        aria-describedby={`${hintId} ${errorId}`}
        onChange={(e) => onValue(e.target.value)}
        className={cn(control, controlState(error), "min-h-36 resize-y leading-relaxed")}
        {...props}
      />
      <div className="flex items-start justify-between gap-4">
        <FieldError id={errorId} message={error} />
        <p id={hintId} className="mt-2 shrink-0 text-xs text-fg-subtle tabular-nums">
          {hint}
        </p>
      </div>
    </div>
  );
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onValue,
  error,
  firstRef,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | "";
  onValue: (value: T) => void;
  error?: string;
  firstRef?: Ref<HTMLInputElement>;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={errorId} aria-invalid={!!error}>
      <legend className="label text-fg-subtle">
        {legend}
        <span className="text-accent" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option, i) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "relative inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-[background-color,border-color,color,scale] duration-300 select-none active:scale-[0.97] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent",
                checked
                  ? "border-fg bg-fg text-ink"
                  : error
                    ? "border-danger/60 text-fg-muted hover:text-fg"
                    : "border-line-strong text-fg-muted hover:border-fg/50 hover:bg-white/[0.04] hover:text-fg",
              )}
            >
              <input
                ref={i === 0 ? firstRef : undefined}
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onValue(option.value)}
                required
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
