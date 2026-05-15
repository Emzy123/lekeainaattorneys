"use server";

import { prisma } from "@lex/database";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

/**
 * Creates a URL-friendly slug from a string.
 */
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
}

/**
 * Creates a plain text excerpt from HTML content.
 */
function createExcerpt(html: string) {
  // Very basic HTML stripping
  const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}

export async function createPost(formData: { title: string; content: string; published: boolean }) {
  // 1. Verify Authentication
  const session = await auth();
  
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized: You must be logged in to create a post.");
  }

  const { title, content, published } = formData;

  if (!title || !content) {
    throw new Error("Missing required fields: Title and Content are required.");
  }

  const slug = generateSlug(title);
  const excerpt = createExcerpt(content);

  // 2. Database Mutation
  try {
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        authorId: session.user.id,
      },
    });

    // 3. Cache Revalidation
    revalidatePath("/posts");
    revalidatePath("/blog");
    
    return { success: true, post: newPost };
  } catch (error: any) {
    console.error("Failed to create post:", error);
    // Handle unique slug constraint errors
    if (error.code === 'P2002') {
      throw new Error("A post with a similar title already exists. Please choose a different title.");
    }
    throw new Error("Failed to save post to the database.");
  }
}

export async function updatePost(
  id: string,
  formData: { title: string; content: string; published: boolean }
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { title, content, published } = formData;
  if (!title || !content) throw new Error("Missing required fields.");

  const excerpt = createExcerpt(content);

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, content, excerpt, published, publishedAt: published ? new Date() : null },
    });
    revalidatePath("/posts");
    revalidatePath("/blog");
    return { success: true, post };
  } catch (error: any) {
    throw new Error("Failed to update post.");
  }
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/posts");
    revalidatePath("/blog");
  } catch {
    throw new Error("Failed to delete post.");
  }
}
