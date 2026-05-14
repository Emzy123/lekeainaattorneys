import { prisma } from "@lex/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';
import { ChevronRight, Calendar, Linkedin, Twitter, Mail, Link as LinkIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@lex/ui";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug }
  });
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} | LEX Platform`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      category: true,
    }
  });

  if (!post) {
    notFound();
  }

  // Fetch related posts (mocked to just latest 3)
  const relatedPosts = await prisma.blogPost.findMany({
    take: 3,
    where: { 
      published: true,
      id: { not: post.id }
    },
    include: {
      author: true,
      category: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white pt-[80px]">
      
      {/* Article Hero */}
      <section className="max-w-4xl mx-auto w-full px-6 py-12 text-center">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center text-[12px] font-body text-lex-slate tracking-wider mb-8">
          <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href="/blog" className="hover:text-lex-gold transition-colors">Insights</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-lex-navy font-semibold line-clamp-1 max-w-[200px]">{post.title}</span>
        </div>

        {post.category && (
          <Link href={`/blog?category=${post.category.slug}`} className="inline-block px-4 py-1.5 bg-lex-smoke text-lex-navy hover:text-lex-gold transition-colors font-body text-[12px] font-bold uppercase tracking-widest rounded-full mb-6">
            {post.category.name}
          </Link>
        )}

        <h1 className="font-display text-[40px] md:text-[56px] font-bold text-lex-navy leading-tight mb-8">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 font-body text-[14px] text-lex-slate border-t border-lex-navy/10 pt-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-lex-smoke overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-lex-slate text-white font-display font-bold">{post.author.name.charAt(0)}</div>
             </div>
             <div className="text-left">
               <div className="font-bold text-lex-navy">{post.author.name}</div>
               <div className="text-[12px] uppercase tracking-wider">Author</div>
             </div>
          </div>
          <div className="w-[1px] h-8 bg-lex-navy/10"></div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-lex-gold" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Full Width Hero Image */}
      {post.coverImage && (
        <section className="w-full max-w-[1440px] mx-auto px-6 mb-16">
          <div className="aspect-video w-full rounded-sm overflow-hidden bg-lex-smoke relative">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* Article Body */}
      <section className="max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row gap-12 relative pb-24">
        
        {/* Left Sticky Share */}
        <aside className="hidden lg:block w-[64px] flex-shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-4">
            <span className="font-body text-[10px] font-bold text-lex-slate uppercase tracking-widest text-center mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Share Article</span>
            {[
              { icon: Linkedin, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Mail, href: '#' },
              { icon: LinkIcon, href: '#' },
            ].map((social, i) => (
              <a key={i} href={social.href} className="w-12 h-12 rounded-full border border-lex-navy/10 flex items-center justify-center text-lex-slate hover:border-lex-gold hover:text-lex-gold hover:bg-lex-gold/5 transition-all mx-auto">
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </aside>

        {/* Prose Content (680px max width) */}
        <article className="flex-1 max-w-[680px] mx-auto">
          <p className="font-body text-[20px] text-lex-navy leading-relaxed font-medium mb-10">
            {post.excerpt}
          </p>
          <div className="prose prose-lg prose-headings:font-display prose-headings:text-lex-navy prose-h2:text-[32px] prose-h3:text-[24px] prose-p:font-body prose-p:text-lex-slate prose-a:text-lex-gold hover:prose-a:text-lex-navy prose-a:transition-colors max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-lex-navy/10 flex flex-wrap gap-2">
              <span className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-slate mr-4 flex items-center">Tags:</span>
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-lex-smoke text-lex-navy rounded-sm font-body text-[12px]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Card */}
          <div className="mt-16 bg-lex-smoke rounded-sm p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="w-24 h-24 rounded-full bg-lex-silver overflow-hidden flex-shrink-0 border-[3px] border-white shadow-md">
                <div className="w-full h-full flex items-center justify-center bg-lex-slate text-white text-3xl font-display font-bold">{post.author.name.charAt(0)}</div>
            </div>
            <div>
              <h4 className="font-display text-[24px] font-bold text-lex-navy mb-1">{post.author.name}</h4>
              <p className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-gold mb-4">Author</p>
              <p className="font-body text-[14px] text-lex-slate leading-relaxed mb-4">
                {`${post.author.name} provides expert analysis on complex legal developments.`}
              </p>
              <Link href={`/team`} className="font-body text-lex-navy font-bold uppercase tracking-[0.12em] text-[12px] hover:text-lex-gold transition-colors inline-flex items-center gap-2">
                View Full Profile <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </article>

        {/* Right Sticky TOC */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0">
          <div className="sticky top-[120px] bg-lex-smoke p-6 rounded-sm">
            <h4 className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-slate mb-4 border-b border-lex-navy/10 pb-4">Table of Contents</h4>
            <ul className="space-y-3 font-body text-[14px] text-lex-slate">
              <li className="hover:text-lex-gold cursor-pointer transition-colors line-clamp-2">Overview of Legal Changes</li>
              <li className="text-lex-gold font-semibold cursor-pointer transition-colors line-clamp-2 pl-4 border-l-2 border-lex-gold">Implications for Corporate Compliance</li>
              <li className="hover:text-lex-gold cursor-pointer transition-colors line-clamp-2 pl-4 border-l-2 border-transparent">Strategic Next Steps</li>
              <li className="hover:text-lex-gold cursor-pointer transition-colors line-clamp-2">Conclusion</li>
            </ul>
          </div>
        </aside>

      </section>

      {/* Related Posts */}
      <section className="bg-lex-navy py-24 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-[32px] font-bold text-white">Further Reading</h2>
            <Link href="/blog" className="font-body text-white font-bold uppercase tracking-[0.12em] text-[12px] hover:text-lex-gold transition-colors hidden sm:flex items-center gap-2">
                View All Insights <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <Card key={rp.id} className="group hover:-translate-y-2 hover:shadow-xl transition-all duration-normal ease-lex-standard border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden rounded-sm flex flex-col">
                  {/* Image Container */}
                  <div className="aspect-video w-full overflow-hidden bg-white/5 relative">
                    {rp.coverImage ? (
                      <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full bg-lex-slate/50 flex items-center justify-center">
                         <span className="font-display text-white/20 text-3xl font-bold">LEX</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-1">
                    {rp.category && (
                       <span className="text-lex-gold font-body text-[10px] font-bold uppercase tracking-wider mb-3">
                         {rp.category.name}
                       </span>
                    )}
                    <h4 className="font-display text-[20px] font-bold text-white mb-4 line-clamp-2 leading-tight">
                      {rp.title}
                    </h4>
                    
                    <div className="mt-auto flex items-center justify-between font-body text-[12px] text-white/60">
                      <span>{new Date(rp.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <Link href={`/blog/${rp.slug}`} className="font-bold uppercase tracking-widest text-white group-hover:text-lex-gold transition-colors flex items-center gap-2">
                        Read <ArrowRight size={14} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
