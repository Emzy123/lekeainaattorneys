import { prisma } from "@lex/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';
import { Scale, ChevronRight, CheckCircle2, ChevronDown } from "lucide-react";
import { Button, Card, CardContent } from "@lex/ui";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const area = await prisma.practiceArea.findUnique({
    where: { slug: params.slug }
  });
  
  if (!area) return { title: 'Practice Area Not Found' };
  
  return {
    title: `${area.title} | LEX Platform`,
    description: area.description,
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: { slug: string } }) {
  const area = await prisma.practiceArea.findUnique({
    where: { slug: params.slug }
  });

  if (!area) {
    notFound();
  }

  // Fetch related attorneys (mocked for now, or just get some team members)
  const relatedAttorneys = await prisma.teamMember.findMany({
    take: 2,
    where: { published: true }
  });

  const allPracticeAreas = await prisma.practiceArea.findMany({
    take: 8,
    orderBy: { title: 'asc' },
    where: { published: true }
  });

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke pt-[80px]">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content (Left) */}
        <div className="flex-1 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-[12px] font-body text-lex-slate tracking-wider">
            <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <Link href="/practice-areas" className="hover:text-lex-gold transition-colors">Practice Areas</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-lex-navy font-semibold">{area.title}</span>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <div className="w-20 h-20 bg-lex-navy flex items-center justify-center rounded-sm">
              <Scale className="w-10 h-10 text-lex-gold" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-[48px] font-bold text-lex-navy leading-tight">
              {area.title}
            </h1>
            <p className="font-body text-[20px] text-lex-slate leading-relaxed">
              {area.description}
            </p>
          </div>

          {/* Rich Text Body (Mocked) */}
          <div className="prose prose-lg max-w-none text-lex-slate font-body">
            <p>Our {area.title.toLowerCase()} practice provides comprehensive counsel to corporations, financial institutions, and high-net-worth individuals. We navigate complex regulatory frameworks and high-stakes disputes with precision and uncompromising dedication.</p>
            <h3 className="font-display text-[24px] font-bold text-lex-navy mt-8 mb-4">Core Capabilities</h3>
            <ul className="space-y-3 list-none pl-0">
              {['Strategic Advisory & Compliance', 'Complex Dispute Resolution', 'Cross-Border Transactions', 'Regulatory Investigations'].map((cap, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lex-gold flex-shrink-0 mt-0.5" />
                  <span className="text-lex-navy font-medium">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Case Examples */}
          <div>
            <h3 className="font-display text-[28px] font-bold text-lex-navy mb-6 border-b border-lex-navy/10 pb-4">Representative Matters</h3>
            <div className="space-y-4">
              {[1, 2].map((caseId) => (
                <div key={caseId} className="bg-white p-6 border-l-4 border-lex-gold rounded-r-sm shadow-sm">
                  <h4 className="font-display text-[18px] font-bold text-lex-navy mb-2">Major Corporate Defense ({2024 - caseId})</h4>
                  <p className="font-body text-[14px] text-lex-slate">Successfully defended a Fortune 500 entity in a multi-jurisdictional class action, resulting in a complete dismissal of all claims.</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion (Mocked styling) */}
          <div>
            <h3 className="font-display text-[28px] font-bold text-lex-navy mb-6 border-b border-lex-navy/10 pb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((faq) => (
                <div key={faq} className="bg-white border border-lex-navy/10 rounded-sm overflow-hidden">
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-lex-smoke/50 transition-colors">
                    <span className="font-body font-bold text-lex-navy">What is the typical timeline for a {area.title.toLowerCase()} matter?</span>
                    <ChevronDown className="w-5 h-5 text-lex-gold" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <aside className="w-full lg:w-[320px] space-y-8 lg:sticky lg:top-[100px] h-fit">
          
          {/* Consultation CTA Card */}
          <div className="bg-lex-navy text-white p-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lex-gold/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="font-display text-[24px] font-bold mb-3">Require Counsel?</h3>
            <p className="font-body text-[14px] text-white/80 mb-6">Connect with our {area.title.toLowerCase()} specialists for a confidential assessment.</p>
            <Button className="w-full bg-lex-gold text-lex-navy hover:bg-lex-gold-light">
              Book Consultation
            </Button>
            <Button className="w-full mt-3 border border-white/20 text-white hover:bg-white/10 bg-transparent">
              Call +1 (800) LEX-FIRM
            </Button>
          </div>

          {/* Related Attorneys */}
          <div className="bg-white border border-lex-navy/10 p-6 rounded-sm">
            <h4 className="font-body font-bold text-[12px] tracking-widest text-lex-slate uppercase mb-6">Key Contacts</h4>
            <div className="space-y-4">
              {relatedAttorneys.map((attorney) => (
                <Link href={`/team/${attorney.id}`} key={attorney.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-lex-smoke overflow-hidden border-2 border-transparent group-hover:border-lex-gold transition-colors">
                     {attorney.photo ? (
                      <img src={attorney.photo} alt={attorney.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lex-slate text-white text-lg font-display">{attorney.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-display font-bold text-[16px] text-lex-navy group-hover:text-lex-gold transition-colors">{attorney.name}</div>
                    <div className="font-body text-[11px] text-lex-slate uppercase tracking-wider">{attorney.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Practice Areas List */}
          <div className="bg-white border border-lex-navy/10 p-6 rounded-sm">
            <h4 className="font-body font-bold text-[12px] tracking-widest text-lex-slate uppercase mb-4">All Practice Areas</h4>
            <ul className="space-y-2">
              {allPracticeAreas.map((pa) => (
                <li key={pa.id}>
                  <Link href={`/practice-areas/${pa.slug}`} className={`flex items-center justify-between py-2 border-b border-lex-smoke font-body text-[14px] ${pa.slug === params.slug ? 'text-lex-gold font-bold' : 'text-lex-slate hover:text-lex-navy'}`}>
                    <span>{pa.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
