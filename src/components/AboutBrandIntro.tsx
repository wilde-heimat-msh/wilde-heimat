import Image from "next/image";
import { aboutBrandIntro } from "@/data/about";

export function AboutBrandIntro() {
  return (
    <div className="about-brand-intro mx-auto max-w-3xl">
      <figure className="about-brand-logo animate-float-slow" aria-hidden={false}>
        <Image
          src="/logo-wilde-heimat.png"
          alt="Wilde Heimat – Logo mit Bergen, Wald, Waschbär, Fuchs und Hase"
          width={300}
          height={300}
          className="h-full w-full rounded-full object-contain"
          sizes="(max-width: 767px) 220px, 280px"
        />
        <figcaption className="sr-only">Wilde Heimat Logo</figcaption>
      </figure>

      <div className="text-base leading-relaxed text-muted md:text-lg">
        {aboutBrandIntro.map((paragraph, index) => (
          <p key={paragraph.slice(0, 24)} className={index > 0 ? "mt-4" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
