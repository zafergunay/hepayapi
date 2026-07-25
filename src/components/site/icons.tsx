// Line-weight technical icon set for service cards. Deliberately drafting-style
// (1.5px strokes, no fill) rather than glyph/emoji icons, to keep the
// "engineering drawing" language consistent across the site.

type IconProps = {
  className?: string;
};

function Base({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      strokeWidth={1.5}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// Column cross-section with rebar cage — "kolon güçlendirme"
export function IconColumn(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="8" y="8" width="24" height="24" rx="2" />
      <circle cx="13.5" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="26.5" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="26.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="26.5" cy="26.5" r="1.4" fill="currentColor" stroke="none" />
      <rect x="12.5" y="12.5" width="15" height="15" strokeDasharray="1.5 2.5" />
    </Base>
  );
}

// Wrapped fiber layers — "karbon fiber güçlendirme"
export function IconFiber(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="10" y="6" width="20" height="28" rx="3" />
      <path d="M10 13h20" />
      <path d="M10 19.5h20" />
      <path d="M10 26h20" />
      <path d="M15 6v28" strokeDasharray="1.5 2.5" opacity={0.6} />
      <path d="M25 6v28" strokeDasharray="1.5 2.5" opacity={0.6} />
    </Base>
  );
}

// Foundation section with footing — "temel güçlendirme"
export function IconFoundation(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 32h24" />
      <path d="M12 32V22h16v10" />
      <path d="M17 22V9h6v13" />
      <path d="M8 32l3-3M13 32l3-3M18 32l3-3M23 32l3-3M28 32l3-3" opacity={0.6} />
    </Base>
  );
}

// Seismograph / risk trace — "deprem risk analizi"
export function IconAnalysis(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="8" width="28" height="24" rx="2" />
      <path d="M9 20h4l2.5-7 3 14 3-10 2 3h7.5" />
    </Base>
  );
}

// Plan sheet with title block — "statik proje"
export function IconBlueprint(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="7" y="6" width="26" height="28" rx="1.5" />
      <path d="M11 12h10M11 17h14M11 22h14M11 27h8" />
      <path d="M7 30h26" opacity={0.6} />
    </Base>
  );
}

// Generic shield — "genel güvence / güçlendirme"
export function IconShield(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 6l12 5v9c0 8-5.5 13-12 14-6.5-1-12-6-12-14v-9l12-5z" />
      <path d="M15.5 20l3 3.5 6-7.5" />
    </Base>
  );
}

// Crane / new construction — "inşaat"
export function IconBuilding(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 34V12l8-4v26" />
      <path d="M18 18h9v16h-9" />
      <path d="M21 22h3M21 26h3M21 30h3" />
    </Base>
  );
}

const registry: Record<string, (props: IconProps) => React.ReactElement> = {
  column: IconColumn,
  kolon: IconColumn,
  fiber: IconFiber,
  "karbon-fiber": IconFiber,
  foundation: IconFoundation,
  temel: IconFoundation,
  analysis: IconAnalysis,
  risk: IconAnalysis,
  blueprint: IconBlueprint,
  proje: IconBlueprint,
  shield: IconShield,
  building: IconBuilding,
  insaat: IconBuilding,
};

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = registry[icon] ?? IconShield;
  return <Icon className={className} />;
}

export function IconMenu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} strokeWidth={1.6} stroke="currentColor" strokeLinecap="round">
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} strokeWidth={1.6} stroke="currentColor" strokeLinecap="round">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} strokeWidth={1.6} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} strokeWidth={1.6} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} strokeWidth={1.6} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
