"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    redirect("/admin/login");
  }
}

const serviceSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur."),
  slug: z
    .string()
    .min(1, "Slug zorunludur.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  summary: z.string().min(1, "Özet zorunludur."),
  body: z.string().min(1, "İçerik zorunludur."),
  icon: z.string().min(1, "İkon adı zorunludur."),
  order: z.coerce.number().int().default(0),
});

function revalidateServicePaths(slug?: string) {
  revalidatePath("/admin/hizmetler");
  revalidatePath("/");
  revalidatePath("/hizmetler");
  if (slug) revalidatePath(`/hizmetler/${slug}`);
}

export async function createService(formData: FormData) {
  await requireSession();

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    icon: formData.get("icon"),
    order: formData.get("order"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  await prisma.service.create({ data: parsed.data });

  revalidateServicePaths(parsed.data.slug);
  redirect("/admin/hizmetler");
}

export async function updateService(id: string, formData: FormData) {
  await requireSession();

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    icon: formData.get("icon"),
    order: formData.get("order"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  await prisma.service.update({ where: { id }, data: parsed.data });

  revalidateServicePaths(parsed.data.slug);
  redirect("/admin/hizmetler");
}

export async function deleteService(id: string) {
  await requireSession();

  const service = await prisma.service.delete({ where: { id } });

  revalidateServicePaths(service.slug);
  redirect("/admin/hizmetler");
}
