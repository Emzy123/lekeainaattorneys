import React from 'react';
import Link from 'next/link';
import { prisma } from "@lex/database";
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Frequently Asked Questions | LEX Platform' };

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: 'asc' }
  });

  const categories = Array.from(new Set(faqs.map(f => f.category || 'General')));

  return (
    <div className="bg-lex-smoke min-h-screen pb-24">
      {/* Header */}
      <section className="bg-lex-navy text-white pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="font-body text-[12px] font-bold text-lex-gold uppercase tracking-[0.2em] mb-4">
            Support & Information
          </div>
          <h1 className="font-display text-[48px] sm:text-[64px] font-bold leading-[1.1] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-[18px] text-lex-slate max-w-2xl mx-auto leading-relaxed">
            Clear, authoritative answers to common inquiries regarding our legal services, consultation process, and digital resources.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 -mt-8 relative z-20">
        <div className="bg-white p-8 sm:p-12 shadow-xl border border-lex-navy/5">
          {categories.map((category) => (
            <div key={category} className="mb-12 last:mb-0">
              <h2 className="font-display text-[24px] font-bold text-lex-navy mb-6 border-b border-lex-navy/10 pb-4">
                {category}
              </h2>
              <div className="space-y-4">
                {faqs.filter(f => (f.category || 'General') === category).map((faq) => (
                  <details key={faq.id} className="group bg-lex-smoke/30 border border-lex-navy/10 p-5 cursor-pointer hover:border-lex-gold transition-colors">
                    <summary className="font-body text-[16px] font-bold text-lex-navy flex justify-between items-center list-none outline-none">
                      {faq.question}
                      <span className="text-lex-gold group-open:rotate-180 transition-transform duration-300">
                        <ChevronDown size={20} />
                      </span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-lex-navy/10 font-body text-[15px] text-lex-slate leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-[16px] text-lex-slate">FAQ documentation is currently being updated.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-lex-gold p-12">
          <MessageCircle size={32} className="text-lex-navy mx-auto mb-4" />
          <h3 className="font-display text-[28px] font-bold text-lex-navy mb-4">
            Still have questions?
          </h3>
          <p className="font-body text-[16px] text-lex-navy/80 mb-8 max-w-lg mx-auto">
            Our intake team is available to assist you with specific inquiries regarding your legal matter.
          </p>
          <Link href="/consultation" className="inline-flex items-center gap-2 bg-lex-navy text-white font-body text-[13px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-lex-navy/90 transition-colors">
            Request Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
