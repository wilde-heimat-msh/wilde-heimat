import Link from "next/link";

type BackLinkProps = {
  href: string;
  label: string;
  light?: boolean;
};

export function BackLink({ href, label, light = true }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        light
          ? "text-background/70 hover:text-background"
          : "text-muted hover:text-foreground"
      }`}
    >
      ← {label}
    </Link>
  );
}
