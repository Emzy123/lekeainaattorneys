import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@lex/ui";
import { prisma } from "@lex/database";
import Link from "next/link";
import { Metadata } from 'next';
import { Scale, Search, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: 'Practice Areas | LEX Platform',
  description: 'Comprehensive legal services for modern challenges.',
};

export default async function PracticeAreasPage() {
  const practiceAreas = await prisma.practiceArea.findMany({
    orderBy: { title: 'asc' },
    where: { published: true }
  });

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-lex-navy overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lex-slate/40 via-lex-navy to-lex-navy z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center text-[12px] font-body text-white/60 tracking-wider mb-6">
            <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-lex-gold font-semibold">Practice Areas</span>
          </div>
          
          <h1 className="font-display text-[48px] md:text-[64px] font-bold text-white leading-tight">
            Our Expertise
          </h1>
          
          <div className="max-w-2xl mx-auto mt-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-lex-gold" />
            </div>
            <input 
              type="text" 
              placeholder="What legal matter can we help with?" 
              className="block w-full pl-12 pr-4 py-4 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-lex-gold focus:ring-0 transition-all font-body text-[16px] shadow-lg backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Filter & Grid Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        {/* Filter Tabs (Mocked visually for Server Component) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {['All', 'Corporate', 'Litigation', 'Family', 'Property', 'Regulatory'].map((tab, i) => (
            <button 
              key={tab} 
              className={`px-6 py-2 rounded-full font-body text-[14px] font-bold uppercase tracking-wider transition-all duration-fast ${i === 0 ? 'bg-lex-navy text-lex-smoke' : 'bg-transparent border border-lex-navy/20 text-lex-navy hover:border-lex-gold hover:text-lex-gold'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.length === 0 ? (
            <p className="text-lex-slate text-center col-span-3">No practice areas currently listed.</p>
          ) : (
            practiceAreas.map((area) => (
              <Card key={area.id} className="hover:-translate-y-2 hover:shadow-xl transition-all duration-normal ease-lex-standard border-none rounded-sm group relative overflow-hidden bg-white">
                <div className="absolute inset-0 border-[3px] border-lex-gold opacity-0 group-hover:opacity-100 transition-opacity duration-normal ease-lex-standard rounded-sm pointer-events-none"></div>
                
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-lex-navy flex items-center justify-center mb-6">
                    <Scale className="w-8 h-8 text-lex-gold" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="group-hover:text-lex-gold transition-colors duration-normal font-display text-[24px] font-bold text-lex-navy">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 font-body text-[16px] text-lex-slate leading-relaxed">
                    {area.description || 'Dedicated legal counsel and strategic representation tailored to your business objectives.'}
                  </CardDescription>
                  <div className="mt-8">
                    <Link href={`/practice-areas/${area.slug}`} className="font-body text-lex-navy font-bold uppercase tracking-[0.12em] text-[12px] group-hover:text-lex-gold transition-colors flex items-center gap-2">
                      Learn More <span className="text-lex-gold">→</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
