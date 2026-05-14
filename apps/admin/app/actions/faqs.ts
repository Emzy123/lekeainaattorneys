"use server";

import { prisma } from "@lex/database";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function createFaq(formData: {
  question: string;
  answer: string;
  category?: string;
  published: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { question, answer, category, published } = formData;
  if (!question || !answer) throw new Error("Question and answer are required.");

  try {
    const faq = await prisma.fAQ.create({
      data: { question, answer, category: category || null, published },
    });
    revalidatePath("/faq");
    return { success: true, faq };
  } catch {
    throw new Error("Failed to save FAQ.");
  }
}

export async function updateFaq(
  id: string,
  formData: { question: string; answer: string; category?: string; published: boolean }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: { ...formData },
    });
    revalidatePath("/faq");
    return { success: true, faq };
  } catch {
    throw new Error("Failed to update FAQ.");
  }
}

export async function deleteFaq(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath("/faq");
    return { success: true };
  } catch {
    throw new Error("Failed to delete FAQ.");
  }
}
