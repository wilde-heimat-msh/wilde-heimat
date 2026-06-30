import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "inverse";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

const base =
  "btn-hover inline-flex items-center justify-center min-h-11 px-6 py-3 text-sm font-medium tracking-wide rounded-xl active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:bg-accent border border-foreground shadow-soft hover:shadow-soft-hover",
  secondary:
    "bg-muted-light text-foreground hover:bg-border border border-border shadow-soft hover:shadow-soft-hover",
  outline:
    "bg-background/80 text-foreground hover:bg-muted-light border border-foreground/80 shadow-sm hover:shadow-soft",
  inverse:
    "bg-background/10 text-background hover:bg-background/20 border border-background/80 backdrop-blur-sm shadow-sm hover:shadow-md",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
