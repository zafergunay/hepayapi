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

const blogSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur."),
  slug: z
    .string()
    .min(1, "Slug zorunludur.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  excerpt: z.string().min(1, "Özet zorunludur."),
  body: z.string().min(1, "İçerik zorunludur."),
  coverImage: z.string().min(1, "Kapak görseli zorunludur."),
  published: z.coerce.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(formData: FormData) {
  await requireSession();

  const parsed = blogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "on",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  const { published, ...rest } = parsed.data;

  await prisma.blogPost.create({
    data: {
      ...rest,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidateBlogPaths(parsed.data.slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireSession();

  const parsed = blogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "on",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Geçersiz form verisi.");
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const { published, ...rest } = parsed.data;

  let publishedAt: Date | null = null;
  if (published) {
    publishedAt = existing?.publishedAt ?? new Date();
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      published,
      publishedAt,
    },
  });

  revalidateBlogPaths(parsed.data.slug);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireSession();

  const post = await prisma.blogPost.delete({ where: { id } });

  revalidateBlogPaths(post.slug);
  redirect("/admin/blog");
}
