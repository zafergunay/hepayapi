"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function markMessageAsRead(id: string) {
  await requireSession();
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireSession();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin");
}
