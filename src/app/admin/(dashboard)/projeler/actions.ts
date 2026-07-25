"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Region } from "@/generated/prisma/client";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    redirect("/admin/login");
  }
}

const projectSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur."),
  slug: z
    .string()
    .min(1, "Slug zorunludur.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  region: z.enum([Region.MARAS, Region.HATAY, Region.ADIYAMAN]),
  summary: z.string().min(1, "Özet zorunludur."),
  body: z.string().min(1, "İçerik zorunludur."),
  coverImage: z.string().min(1, "Kapak görseli zorunludur."),
  gallery: z.string().default("[]"),
});

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/admin/projeler");
  revalidatePath("/");
  revalidatePath("/projeler");
  if (slug) revalidatePath(`/projeler/${slug}`);
}

function parseGallery(raw: FormDataEntryValue | null): string {
  if (typeof raw !== "string" || raw.trim() === "") return "[]";
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value)) return JSON.stringify(value);
    return "[]";
  } catch {
    return "[]";
  }
}

export async function createProject(formData: FormData) {
  await requireSession();

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    region: formData.get("region"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage"),
    gallery: parseGallery(formData.get("gallery")),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  await prisma.project.create({ data: parsed.data });

  revalidateProjectPaths(parsed.data.slug);
  redirect("/admin/projeler");
}

export async function updateProject(id: string, formData: FormData) {
  await requireSession();

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    region: formData.get("region"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage"),
    gallery: parseGallery(formData.get("gallery")),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  await prisma.project.update({ where: { id }, data: parsed.data });

  revalidateProjectPaths(parsed.data.slug);
  redirect("/admin/projeler");
}

export async function deleteProject(id: string) {
  await requireSession();

  const project = await prisma.project.delete({ where: { id } });

  revalidateProjectPaths(project.slug);
  redirect("/admin/projeler");
}
