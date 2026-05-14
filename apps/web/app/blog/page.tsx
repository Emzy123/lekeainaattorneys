import { prisma } from "@lex/database";
import Link from "next/link";
import { Metadata } from 'next';
import { ChevronRight, Calendar, User as UserIcon, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, Button } from "@lex/ui";

export const metadata: Metadata = {
  title: 'Insights & Perspectives | LEX Platform',
  description: 'Legal insights, analysis, and news from our firm.',
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    where: { published: true },
    include: {
      author: true,
      category: true,
    }
  });

  const categories = await prisma.blogCategory.findMany({
    where: { published: true }
  });

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const standardPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke pt-[80px]">
      
      {/* Featured Post Hero */}
      {featuredPost && (
        <section className="relative h-[60vh] min-h-[500px] w-full group cursor-pointer overflow-hidden">
          <Link href={`/blog/${featuredPost.slug}`} className="absolute inset-0 z-20">
            <span className="sr-only">Read {featuredPost.title}</span>
          </Link>
          
          {/* Background Image */}
          <div className="absolute inset-0 bg-lex-navy transition-transform duration-slow ease-lex-standard group-hover:scale-105">
            {featuredPost.coverImage ? (
              <img src={featuredPost.coverImage} alt={featuredPost.title} className="w-full h-full object-cover mix-blend-overlay opacity-60" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-lex-navy to-lex-slate opacity-80"></div>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-lex-navy via-lex-navy/60 to-transparent z-10"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20 max-w-7xl mx-auto">
            <div className="max-w-3xl">
              {featuredPost.category && (
                <span className="inline-block px-4 py-1 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest rounded-sm mb-6">
                  {featuredPost.category.name}
                </span>
              )}
              
              <h1 className="font-display text-[40px] md:text-[56px] font-bold text-white leading-tight mb-6 group-hover:text-lex-gold transition-colors duration-normal">
                {featuredPost.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 font-body text-[14px] text-white/80">
                <div className="flex items-center gap-2">
                  <UserIcon size={16} className="text-lex-gold" />
                  <span>{featuredPost.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-lex-gold" />
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 space-y-12">
          
          {/* Categories */}
          <div>
            <h3 className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-slate mb-6 flex items-center gap-2">
              <Tag size={14} className="text-lex-gold" />
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="flex items-center justify-between font-body text-[15px] text-lex-navy font-semibold hover:text-lex-gold transition-colors">
                  <span>All Insights</span>
                  <span className="text-lex-slate/50 text-[12px]">{posts.length}</span>
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/blog?category=${cat.slug}`} className="flex items-center justify-between font-body text-[15px] text-lex-slate hover:text-lex-navy transition-colors">
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Widget */}
          <div className="bg-lex-navy text-white p-8 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-lex-gold/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-display text-[24px] font-bold mb-3 relative z-10">Lex Insights</h3>
            <p className="font-body text-[14px] text-white/80 mb-6 relative z-10">Receive critical legal updates and firm news directly in your inbox.</p>
            <form className="space-y-3 relative z-10">
              <input 
                type="email" 
                placeholder="Business Email" 
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[14px] py-3 px-4"
              />
              <Button className="w-full bg-lex-gold text-lex-navy hover:bg-lex-gold-light rounded-sm font-bold tracking-widest text-[12px]">
                SUBSCRIBE
              </Button>
            </form>
          </div>

        </aside>

        {/* Right Content: Blog Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-lex-navy/10 pb-4">
            <h2 className="font-display text-[28px] font-bold text-lex-navy">Latest Perspectives</h2>
          </div>

          {standardPosts.length === 0 ? (
            <p className="text-lex-slate font-body text-[16px]">No additional posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {standardPosts.map((post) => (
                <Card key={post.id} className="group hover:-translate-y-2 hover:shadow-xl transition-all duration-normal ease-lex-standard border border-lex-navy/5 bg-white overflow-hidden rounded-sm flex flex-col h-full">
                  {/* Image Container (16:9) */}
                  <div className="aspect-video w-full overflow-hidden bg-lex-navy/5 relative">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow" />
                    ) : (
                      <div className="w-full h-full bg-lex-slate flex items-center justify-center">
                         <span className="font-display text-white/20 text-4xl font-bold">LEX</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-lex-gold text-lex-navy font-body text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
                        {post.category.name}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h4 className="font-display text-[20px] font-bold text-lex-navy mb-3 line-clamp-2 group-hover:text-lex-gold transition-colors leading-tight">
                      {post.title}
                    </h4>
                    <p className="font-body text-[14px] text-lex-slate line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto border-t border-lex-smoke pt-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between font-body text-[12px] text-lex-slate">
                        <span className="font-bold text-lex-navy">{post.author.name}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-navy group-hover:text-lex-gold transition-colors flex items-center gap-2">
                        Read Article <ArrowRight size={14} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination (Mocked) */}
          {standardPosts.length > 6 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-sm flex items-center justify-center border border-lex-navy/10 text-lex-slate hover:border-lex-navy hover:text-lex-navy transition-colors bg-white font-body text-[14px] font-bold">
                1
              </button>
              <button className="w-10 h-10 rounded-sm flex items-center justify-center bg-lex-navy text-white font-body text-[14px] font-bold">
                2
              </button>
              <button className="w-10 h-10 rounded-sm flex items-center justify-center border border-lex-navy/10 text-lex-slate hover:border-lex-navy hover:text-lex-navy transition-colors bg-white font-body text-[14px] font-bold">
                3
              </button>
              <span className="text-lex-slate">...</span>
              <button className="w-10 h-10 rounded-sm flex items-center justify-center border border-lex-navy/10 text-lex-slate hover:border-lex-navy hover:text-lex-navy transition-colors bg-white font-body text-[14px] font-bold">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
