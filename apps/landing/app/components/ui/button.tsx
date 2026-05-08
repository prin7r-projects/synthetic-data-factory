"use client";

/**
 * [FOUNDRY7_BUTTON] Vendored from shadcn/ui (Button) and re-themed against
 * the Mintset tokens. Square edges, ink fill, ember on hover. The source
 * is owned by this repo per the Prin7r ShadCN-first baseline (DESIGN.md §3).
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "ghost" | "ember" | "outline-light";
type ButtonSize = "default" | "sm" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-sans font-medium leading-none transition-colors duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variantClasses: Record<ButtonVariant, string> = {
  // [MINTSET_DARK_PIVOT 2026-05-08] Re-tuned for graphite canvas.
  // default: light-on-dark (sodium fill, graphite text). ghost: hairline outline on dark.
  default: "bg-sodium text-graphite border border-sodium hover:bg-ember hover:border-ember hover:text-sodium",
  ghost: "bg-transparent text-sodium border border-sodium/35 hover:bg-sodium hover:text-graphite",
  ember: "bg-ember text-sodium border border-ember hover:bg-ember-2 hover:border-ember-2",
  "outline-light": "bg-transparent text-sodium border border-sodium/40 hover:border-ember hover:text-ember"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-5 text-[15px]",
  sm: "h-10 px-4 text-sm",
  lg: "h-14 px-6 text-[17px]"
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], "rounded-none", className)}
      {...props}
    />
  );
});

export type ButtonAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const ButtonAnchor = React.forwardRef<HTMLAnchorElement, ButtonAnchorProps>(function ButtonAnchor(
  { className, variant = "default", size = "default", ...props },
  ref
) {
  return (
    <a
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], "rounded-none", className)}
      {...props}
    />
  );
});
