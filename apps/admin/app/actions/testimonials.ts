"use server";

import { prisma } from "@lex/database";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function createTestimonial(formData: {
  name: string;
  company?: string;
  content: string;
  rating: number;
  published: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { name, company, content, rating, published } = formData;
  if (!name || !content) throw new Error("Name and content are required.");

  try {
    const testimonial = await prisma.testimonial.create({
      data: { name, company: company || null, content, rating: Number(rating), published },
    });
    revalidatePath("/testimonials");
    return { success: true, testimonial };
  } catch {
    throw new Error("Failed to save testimonial.");
  }
}

export async function updateTestimonial(
  id: string,
  formData: { name: string; company?: string; content: string; rating: number; published: boolean }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { ...formData, rating: Number(formData.rating) },
    });
    revalidatePath("/testimonials");
    return { success: true, testimonial };
  } catch {
    throw new Error("Failed to update testimonial.");
  }
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/testimonials");
    return { success: true };
  } catch {
    throw new Error("Failed to delete testimonial.");
  }
}
