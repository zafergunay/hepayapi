export function SectionLabel({
  index,
  children,
  tone = "light",
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-2.5">
      {index ? (
        <span
          className={`font-mono text-[11px] tracking-[0.14em] ${
            tone === "dark" ? "text-accent-bright" : "text-accent"
          }`}
        >
          {index}
        </span>
      ) : null}
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
          tone === "dark" ? "text-white/50" : "text-muted"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
