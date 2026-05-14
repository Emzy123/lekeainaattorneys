import { prisma } from "@lex/database";
import { GripVertical, Scale, Edit2, Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function PracticeAreasPage() {
  const practiceAreas = await prisma.practiceArea.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex items-center justify-between mb-8 border-b border-lex-navy/10 pb-6">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Practice Areas</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage service offerings and core competencies.</p>
        </div>
        <button className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors">
          <PlusCircle size={16} /> Add Practice Area
        </button>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_120px_120px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div></div>
          <div>Title & Slug</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-lex-navy/5">
          {practiceAreas.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No practice areas defined. Click "Add Practice Area" to begin.
            </div>
          ) : (
            practiceAreas.map((area) => (
              <div key={area.id} className="grid grid-cols-[40px_1fr_120px_120px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                <div className="text-lex-slate/30 group-hover:text-lex-slate cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-lex-navy/5 flex items-center justify-center border border-lex-navy/10">
                    <Scale size={20} className="text-lex-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-display text-[16px] font-bold text-lex-navy">{area.title}</div>
                    <div className="font-body text-[12px] text-lex-slate font-mono mt-0.5">/{area.slug}</div>
                  </div>
                </div>

                <div>
                  {area.published ? (
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
                  <Link href={`/practice-areas/${area.id}`} className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors" title="Edit">
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
