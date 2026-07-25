// Renders plain-text body content (stored as newline-separated paragraphs in
// the DB, not markdown/HTML) with the site's reading-width typography.

export function ProseBody({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className={`max-w-2xl space-y-5 text-[15px] leading-relaxed text-ink/85 sm:text-base ${className}`}>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
