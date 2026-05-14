import React from 'react';
import { prisma } from "@lex/database";
import { Star, Quote } from 'lucide-react';

export const metadata = { title: 'Client Testimonials | LEX Platform' };

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-lex-smoke min-h-screen pb-24">
      {/* Header */}
      <section className="bg-lex-navy text-white pt-32 pb-20 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="font-body text-[12px] font-bold text-lex-gold uppercase tracking-[0.2em] mb-4">
            Track Record
          </div>
          <h1 className="font-display text-[48px] sm:text-[64px] font-bold leading-[1.1] mb-6">
            Client Testimonials
          </h1>
          <p className="font-body text-[18px] text-lex-slate max-w-2xl mx-auto leading-relaxed">
            Read what our clients have to say about our commitment to excellence, strategic counsel, and unwavering dedication to their success.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mt-16">
        {testimonials.length === 0 ? (
          <div className="text-center py-24 bg-white border border-lex-navy/10 shadow-sm">
            <p className="font-body text-[16px] text-lex-slate">Client reviews will be published shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-8 border border-lex-navy/10 shadow-sm hover:shadow-md hover:border-lex-gold transition-all group flex flex-col h-full">
                <Quote size={32} className="text-lex-gold/30 mb-6 group-hover:text-lex-gold transition-colors" />
                
                <div className="flex gap-1 mb-4 text-lex-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-lex-slate/30"} />
                  ))}
                </div>

                <p className="font-body text-[15px] text-lex-navy leading-relaxed mb-8 flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="pt-6 border-t border-lex-navy/10 mt-auto">
                  <div className="font-display text-[16px] font-bold text-lex-navy">{t.name}</div>
                  {t.company && (
                    <div className="font-body text-[12px] text-lex-slate font-bold uppercase tracking-wider mt-1">
                      {t.company}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
