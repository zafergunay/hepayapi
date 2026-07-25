import Image from "next/image";

// Intrinsic ratios of the generated assets, so a caller only ever sets a height.
const RATIO = {
  compact: "980 / 245",
  full: "997 / 315",
} as const;

const SRC = {
  compact: { light: "/brand/hepa-logo.png", dark: "/brand/hepa-logo-light.png" },
  full: { light: "/brand/hepa-logo-full.png", dark: "/brand/hepa-logo-full-light.png" },
} as const;

/**
 * The brand lockup, in the colourway that suits the surface behind it.
 *
 * `onDark` renders the white/bright-blue recolour. Both files are always in the
 * DOM and cross-fade rather than swapping `src`, because the site header
 * changes surface mid-scroll — swapping the source there would flash an
 * unloaded image every time the hero film ends.
 *
 * `variant="compact"` drops the tagline strip, which is illegible below about
 * 60px of lockup height.
 */
export function BrandLogo({
  variant = "compact",
  onDark = false,
  crossfade = false,
  priority = false,
  className = "",
  sizes = "220px",
}: {
  variant?: "compact" | "full";
  onDark?: boolean;
  crossfade?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const src = SRC[variant];

  if (!crossfade) {
    return (
      <span className={`relative block ${className}`} style={{ aspectRatio: RATIO[variant] }}>
        <Image
          src={onDark ? src.dark : src.light}
          alt="Hepa Yapı"
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain object-left"
        />
      </span>
    );
  }

  return (
    <span className={`relative block ${className}`} style={{ aspectRatio: RATIO[variant] }}>
      <Image
        src={src.light}
        alt="Hepa Yapı"
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain object-left transition-opacity duration-300 ${
          onDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={src.dark}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain object-left transition-opacity duration-300 ${
          onDark ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
