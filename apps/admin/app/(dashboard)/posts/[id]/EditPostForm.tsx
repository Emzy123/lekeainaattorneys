"use client";

import { useState } from "react";
import { RichTextEditor } from "@lex/ui";
import { useRouter } from "next/navigation";
import { updatePost } from "../../../actions/posts";
import { Loader2 } from "lucide-react";

export default function EditPostForm({ post }: { post: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent, published: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await updatePost(post.id, { title, content, published });
      router.push("/posts");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-lex-smoke border border-lex-navy/10 focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[15px] px-4 py-3 text-lex-navy placeholder:text-lex-slate/50 outline-none transition-colors";
  const labelCls = "block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2";

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-sm font-body text-[14px]">
          {error}
        </div>
      )}

      <form className="bg-white rounded-sm border border-lex-navy/10 shadow-sm p-8 space-y-6">
        <div>
          <label className={labelCls}>Post Title</label>
          <input 
            type="text" 
            className={inputCls} 
            placeholder="e.g. Navigating AI Regulations in 2026" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className={labelCls}>Content</label>
          <div className="bg-lex-smoke/50 border border-lex-navy/10 rounded-sm p-2 mb-2">
             <span className="font-body text-[11px] text-lex-slate uppercase tracking-wider px-2">Rich Text Editor</span>
          </div>
          <RichTextEditor 
            value={content} 
            onChange={setContent} 
            placeholder="Start writing your post..." 
          />
        </div>
      </form>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
          className="px-6 py-3 border border-lex-navy/20 text-lex-navy font-body text-[13px] font-bold uppercase tracking-widest rounded-sm hover:border-lex-navy transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="flex-1 bg-lex-gold text-lex-navy hover:bg-lex-gold-light font-body text-[13px] font-bold uppercase tracking-widest py-3 rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (post.published ? 'Update Published Post' : 'Publish Post')}
        </button>
      </div>
    </div>
  );
}
