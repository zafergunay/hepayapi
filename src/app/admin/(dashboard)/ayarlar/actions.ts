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

const settingsSchema = z.object({
  heroTitle: z.string().min(1, "Ana başlık zorunludur."),
  heroSubtitle: z.string().min(1, "Alt başlık zorunludur."),
  phone: z.string().min(1, "Telefon zorunludur."),
  email: z.string().email("Geçerli bir e-posta girin."),
  address: z.string().min(1, "Adres zorunludur."),
  seoTitle: z.string().min(1, "SEO başlığı zorunludur."),
  seoDescription: z.string().min(1, "SEO açıklaması zorunludur."),
});

export async function updateSiteSettings(formData: FormData) {
  await requireSession();

  const parsed = settingsSchema.safeParse({
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/admin/ayarlar");
  revalidatePath("/");
  redirect("/admin/ayarlar");
}
