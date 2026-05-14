import { prisma } from "@lex/database";
import { Edit2, Trash2, PlusCircle, CheckCircle2, XCircle, Star } from "lucide-react";
import Link from "next/link";
import { deleteTestimonial } from "../../actions/testimonials";

export const metadata = { title: 'Testimonials | LEX Admin' };

async function DeleteTestimonialButton({ id }: { id: string }) {
  const action = deleteTestimonial.bind(null, id);
  return (
    <form action={action}>
      <button type="submit" className="p-2 text-lex-slate hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
        <Trash2 size={16} />
      </button>
    </form>
  );
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-lex-navy/10 pb-6 gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Testimonials</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage client reviews and social proof.</p>
        </div>
        <button className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors">
          <PlusCircle size={16} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_100px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div>Client</div>
          <div>Rating</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-lex-navy/5">
          {testimonials.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No testimonials found.
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="grid grid-cols-[1fr_120px_120px_100px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                <div className="pr-4">
                  <div className="font-display text-[16px] font-bold text-lex-navy">{t.name}</div>
                  <div className="font-body text-[12px] text-lex-slate mt-0.5">{t.company || 'Private Client'}</div>
                  <div className="font-body text-[13px] text-lex-navy mt-1.5 italic line-clamp-1">&ldquo;{t.content}&rdquo;</div>
                </div>

                <div className="flex items-center gap-0.5 text-lex-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-lex-slate/30"} />
                  ))}
                </div>

                <div>
                  {t.published ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-body text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lex-smoke text-lex-slate border border-lex-navy/10 font-body text-[11px] font-bold uppercase tracking-wider">
                      <XCircle size={12} /> Hidden
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <DeleteTestimonialButton id={t.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
