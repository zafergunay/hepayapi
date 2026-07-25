"use client";

import { useRef, useState } from "react";

type ImageUploadProps = {
  name: string;
  label?: string;
  defaultValue?: string;
};

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Yükleme başarısız oldu.");
  }

  return data.url as string;
}

/** Single-image uploader. Writes the resulting URL into a hidden input named `name`. */
export function ImageUpload({ name, label, defaultValue = "" }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPending(true);
    setError(null);
    try {
      const uploadedUrl = await uploadFile(file);
      setUrl(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-ink font-mono uppercase tracking-wide">
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-center gap-4">
        {url ? (
          <img
            src={url}
            alt="Önizleme"
            className="h-20 w-20 rounded-md border border-line object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-line-strong text-xs text-muted">
            Görsel yok
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleChange}
            disabled={pending}
            className="text-sm text-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-accent-wash file:cursor-pointer"
          />
          {pending && <p className="text-xs text-muted">Yükleniyor…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

type GalleryUploadProps = {
  name: string;
  label?: string;
  defaultValue?: string[];
};

/** Multi-image uploader. Writes a JSON array of URLs into a hidden input named `name`. */
export function GalleryUpload({ name, label, defaultValue = [] }: GalleryUploadProps) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setPending(true);
    setError(null);
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadFile));
      setUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız oldu.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-ink font-mono uppercase tracking-wide">
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={JSON.stringify(urls)} readOnly />
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className="group relative">
              <img
                src={imageUrl}
                alt={`Galeri görseli ${index + 1}`}
                className="h-20 w-20 rounded-md border border-line object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-graphite text-xs text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Görseli kaldır"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        disabled={pending}
        className="text-sm text-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-accent-wash file:cursor-pointer"
      />
      {pending && <p className="text-xs text-muted">Yükleniyor…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
