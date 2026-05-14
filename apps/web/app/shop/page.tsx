import { prisma } from "@lex/database";
import { Clock, Lock, FileText } from "lucide-react";
import { Metadata } from 'next';
import ShopGrid from "../../components/ShopGrid";

export const metadata: Metadata = {
  title: 'Premium Legal Resources | LEX Platform',
  description: 'Download authoritative legal templates, playbooks, and strategic frameworks crafted by senior counsel.',
};

export default async function ShopPage() {
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      coverImage: true,
      fileType: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">

      {/* Page Hero */}
      <section className="pt-32 pb-20 px-6 bg-lex-navy text-center relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block font-body font-bold text-[11px] tracking-[0.15em] text-lex-gold uppercase mb-6">
            Our Resource Library
          </span>
          <h1 className="font-display text-[48px] md:text-[64px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-lex-gold to-amber-300 leading-tight mb-6">
            Premium Legal Resources
          </h1>
          <p className="font-body text-[18px] text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Authoritative templates, strategic playbooks, and compliance frameworks drafted by senior counsel for modern enterprise operations.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-wider text-white/60">
              <Clock size={18} className="text-lex-gold" /> Instant Delivery
            </div>
            <div className="flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-wider text-white/60">
              <Lock size={18} className="text-lex-gold" /> Secured by Paystack
            </div>
            <div className="flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-wider text-white/60">
              <FileText size={18} className="text-lex-gold" /> PDF &amp; DOCX Formats
            </div>
          </div>
        </div>
      </section>

      {/* Resource Grid — filter bar and search are inside ShopGrid (client) */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <ShopGrid resources={resources} />
      </section>
    </div>
  );
}
