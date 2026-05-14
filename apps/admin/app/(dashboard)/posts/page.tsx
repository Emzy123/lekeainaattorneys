import { prisma } from "@lex/database";
import { Edit2, Trash2, PlusCircle, CheckCircle2, XCircle, Search, Calendar } from "lucide-react";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      author: true
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-lex-navy/10 pb-6 gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Blog Posts</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage firm insights and publications.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-lex-slate" />
            </div>
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="block w-64 pl-10 pr-4 py-2 rounded-sm bg-white border border-lex-navy/20 text-lex-navy placeholder-lex-slate focus:border-lex-gold focus:ring-0 transition-all font-body text-[14px]"
            />
          </div>
          <Link href="/posts/new" className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors">
            <PlusCircle size={16} /> Create Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div>Title</div>
          <div>Category</div>
          <div>Date</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-lex-navy/5">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No posts found. Click "Create Post" to begin.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="grid grid-cols-[1fr_150px_150px_150px_100px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                
                <div className="pr-4">
                  <div className="font-display text-[16px] font-bold text-lex-navy line-clamp-1">{post.title}</div>
                  <div className="font-body text-[12px] text-lex-slate mt-0.5 line-clamp-1">By {post.author?.name || 'Unknown'}</div>
                </div>

                <div className="font-body text-[13px] text-lex-navy">
                  {post.category?.name || <span className="text-lex-slate/50 italic">None</span>}
                </div>

                <div className="flex items-center gap-1.5 font-body text-[13px] text-lex-slate">
                  <Calendar size={14} className="text-lex-gold" />
                  {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                <div>
                  {post.published ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-body text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lex-smoke text-lex-slate border border-lex-navy/10 font-body text-[11px] font-bold uppercase tracking-wider">
                      <XCircle size={12} /> Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Link href={`/posts/${post.id}`} className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </Link>
                  <button className="p-2 text-lex-slate hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
