// Decorative engineering-drawing compositions used in place of photography.
// Pure SVG/CSS, no external assets.

export function ColumnSectionDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 440"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* backdrop grid */}
      <g stroke="currentColor" opacity={0.08}>
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 45} y1={0} x2={i * 45} y2={440} strokeWidth={1} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 44} x2={360} y2={i * 44} strokeWidth={1} />
        ))}
      </g>

      {/* original column outline */}
      <rect x="120" y="70" width="120" height="300" rx="4" stroke="currentColor" strokeWidth={1.5} opacity={0.35} strokeDasharray="3 4" />

      {/* carbon fiber wrap layers */}
      <rect x="108" y="58" width="144" height="324" rx="8" stroke="currentColor" strokeWidth={1.5} />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={`wrap${i}`}
          x1={108}
          y1={58 + (i + 1) * 40}
          x2={252}
          y2={58 + (i + 1) * 40}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {/* rebar cage dots */}
      {[[130, 80], [230, 80], [130, 360], [230, 360]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={4} fill="currentColor" opacity={0.7} />
      ))}
      <rect x="126" y="76" width="108" height="288" stroke="currentColor" strokeWidth={1} strokeDasharray="2 3" opacity={0.4} />

      {/* dimension lines */}
      <g stroke="currentColor" strokeWidth={1}>
        <line x1={108} y1={410} x2={252} y2={410} />
        <line x1={108} y1={404} x2={108} y2={416} />
        <line x1={252} y1={404} x2={252} y2={416} />
      </g>
      <text x="180" y="430" textAnchor="middle" fontSize="11" fill="currentColor" className="font-mono" letterSpacing="0.05em">
        450 mm
      </text>

      <g stroke="currentColor" strokeWidth={1}>
        <line x1={286} y1={58} x2={286} y2={382} />
        <line x1={280} y1={58} x2={292} y2={58} />
        <line x1={280} y1={382} x2={292} y2={382} />
      </g>
      <text x="300" y="224" fontSize="11" fill="currentColor" className="font-mono" letterSpacing="0.05em" transform="rotate(90 300 224)">
        3200 mm
      </text>

      {/* section label */}
      <text x="118" y="42" fontSize="11" fill="currentColor" className="font-mono" letterSpacing="0.08em" opacity={0.75}>
        KESİT A—A · CFRP SARGI
      </text>
    </svg>
  );
}

export function DimensionRule({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-muted ${className}`} aria-hidden="true">
      <span className="h-1.5 w-px bg-line-strong" />
      <span className="h-px flex-1 bg-line-strong" />
      {label ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] shrink-0">{label}</span>
      ) : null}
      <span className="h-px flex-1 bg-line-strong" />
      <span className="h-1.5 w-px bg-line-strong" />
    </div>
  );
}

export function CornerBrackets({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute inset-0 h-full w-full text-line-strong ${className}`}
      aria-hidden="true"
    >
      <path d="M2 12V2h10" stroke="currentColor" strokeWidth={1} fill="none" />
      <path d="M88 2h10v10" stroke="currentColor" strokeWidth={1} fill="none" />
      <path d="M98 88v10H88" stroke="currentColor" strokeWidth={1} fill="none" />
      <path d="M12 98H2V88" stroke="currentColor" strokeWidth={1} fill="none" />
    </svg>
  );
}

export function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`absolute inset-0 h-full w-full text-ink/[0.05] ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={400} stroke="currentColor" strokeWidth={1} />
      ))}
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="currentColor" strokeWidth={1} />
      ))}
    </svg>
  );
}

// Contour / kot lines used as a quiet background texture in dark sections.
export function ContourLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 300" className={className} preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${40 + i * 40} C 150 ${10 + i * 40}, 250 ${70 + i * 40}, 400 ${30 + i * 40} S 550 ${60 + i * 40}, 600 ${30 + i * 40}`}
          stroke="currentColor"
          strokeWidth={1}
          fill="none"
          opacity={0.12}
        />
      ))}
    </svg>
  );
}

export function ProcessArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} aria-hidden="true">
      <line x1="12" y1="0" x2="12" y2="30" stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 3" />
      <path d="M6 26l6 8 6-8" stroke="currentColor" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
