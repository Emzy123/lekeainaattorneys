"use server";

import { prisma } from "@lex/database";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// ─── RESOURCES ────────────────────────────────────────────────────────────────

export async function createResource(formData: {
  title: string;
  description: string;
  fileUrl: string;
  price: number;
  currency: string;
  fileType: string;
  published: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { title, description, fileUrl, price, currency, fileType, published } = formData;
  if (!title || !description || !fileUrl) throw new Error("Missing required fields");

  const slug = generateSlug(title);

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        fileSize: 0, // Updated by upload handler
        fileType: fileType || "PDF",
        price,
        currency: currency || "NGN",
        slug,
        published,
      },
    });
    revalidatePath("/resources");
    revalidatePath("/shop");
    return { success: true, resource };
  } catch (error: any) {
    if (error.code === 'P2002') throw new Error("A resource with this title already exists.");
    throw new Error("Failed to save resource.");
  }
}

export async function updateResource(
  id: string,
  formData: {
    title: string;
    description: string;
    fileUrl: string;
    price: number;
    currency: string;
    fileType: string;
    published: boolean;
  }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { title, description, fileUrl, price, currency, fileType, published } = formData;

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: { title, description, fileUrl, price, currency, fileType, published },
    });
    revalidatePath("/resources");
    revalidatePath("/shop");
    return { success: true, resource };
  } catch (error: any) {
    throw new Error("Failed to update resource.");
  }
}

export async function deleteResource(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.resource.delete({ where: { id } });
    revalidatePath("/resources");
    revalidatePath("/shop");
    return { success: true };
  } catch {
    throw new Error("Failed to delete resource.");
  }
}
