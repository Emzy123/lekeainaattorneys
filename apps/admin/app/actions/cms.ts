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

function createExcerpt(html: string) {
  const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}

export async function createPracticeArea(formData: { title: string; content: string; published: boolean }) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  const { title, content, published } = formData;
  if (!title || !content) throw new Error("Missing fields");

  const slug = generateSlug(title);
  const description = createExcerpt(content);

  try {
    const area = await prisma.practiceArea.create({
      data: { title, slug, description, published },
    });
    revalidatePath("/practice-areas");
    return { success: true, area };
  } catch (error: any) {
    if (error.code === 'P2002') throw new Error("A practice area with this title already exists.");
    throw new Error("Failed to save practice area.");
  }
}

export async function updatePracticeArea(
  id: string,
  formData: { title: string; description: string; published: boolean }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const area = await prisma.practiceArea.update({
      where: { id },
      data: formData,
    });
    revalidatePath("/practice-areas");
    return { success: true, area };
  } catch {
    throw new Error("Failed to update practice area.");
  }
}

export async function deletePracticeArea(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.practiceArea.delete({ where: { id } });
    revalidatePath("/practice-areas");
  } catch {
    throw new Error("Failed to delete practice area.");
  }
}

export async function createTeamMember(formData: { name: string; title: string; bio: string; published: boolean }) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  const { name, title, bio, published } = formData;
  if (!name || !title || !bio) throw new Error("Missing fields");

  try {
    const member = await prisma.teamMember.create({
      data: { name, title, bio, published },
    });
    revalidatePath("/team");
    return { success: true, member };
  } catch (error: any) {
    throw new Error("Failed to save team member.");
  }
}

export async function updateTeamMember(
  id: string,
  formData: { name: string; title: string; bio: string; email?: string; linkedin?: string; published: boolean }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: formData,
    });
    revalidatePath("/team");
    return { success: true, member };
  } catch {
    throw new Error("Failed to update team member.");
  }
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
  } catch {
    throw new Error("Failed to delete team member.");
  }
}
