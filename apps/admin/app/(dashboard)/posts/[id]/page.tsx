import { prisma } from "@lex/database";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });

  if (!post) {
    return (
      <div className="text-center py-24">
        <h2 className="font-display text-[28px] font-bold text-lex-navy">Post not found</h2>
        <Link href="/posts" className="font-body text-lex-gold mt-4 inline-block hover:underline">← Back to Posts</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-normal">
      <div className="flex items-center gap-4 mb-8 border-b border-lex-navy/10 pb-6">
        <Link href="/posts" className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Edit Post</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1 font-mono">/{post.slug}</p>
        </div>
      </div>

      <EditPostForm post={post} />
    </div>
  );
}
