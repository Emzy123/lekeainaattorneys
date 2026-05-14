import { prisma } from "@lex/database";
import { Edit2, Trash2, PlusCircle, CheckCircle2, XCircle, FileText, DollarSign } from "lucide-react";
import Link from "next/link";
import { deleteResource } from "../../actions/resources";

export const metadata = { title: 'Resources | LEX Admin' };

async function DeleteButton({ id }: { id: string }) {
  const action = deleteResource.bind(null, id);
  return (
    <form action={action}>
      <button type="submit" className="p-2 text-lex-slate hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
        <Trash2 size={16} />
      </button>
    </form>
  );
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { purchases: true } } }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-lex-navy/10 pb-6 gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Resources</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage premium legal templates and playbooks for sale.</p>
        </div>
        <Link
          href="/resources/new"
          className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors whitespace-nowrap"
        >
          <PlusCircle size={16} /> Add Resource
        </Link>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_100px_100px_120px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div>Title & Type</div>
          <div>Price</div>
          <div>Sales</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-lex-navy/5">
          {resources.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No resources listed. Click &ldquo;Add Resource&rdquo; to begin.
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="grid grid-cols-[1fr_120px_100px_100px_120px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                <div className="flex items-center gap-4 pr-4">
                  <div className="w-10 h-10 rounded-sm bg-lex-navy/5 flex items-center justify-center border border-lex-navy/10 flex-shrink-0">
                    <FileText size={18} className="text-lex-gold" />
                  </div>
                  <div>
                    <div className="font-display text-[15px] font-bold text-lex-navy line-clamp-1">{resource.title}</div>
                    <div className="font-body text-[11px] text-lex-slate font-mono mt-0.5 uppercase">{resource.fileType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-body text-[14px] font-bold text-lex-navy">
                  <DollarSign size={14} className="text-lex-gold" />
                  {(resource.price / 100).toLocaleString()}
                  <span className="text-[10px] font-normal text-lex-slate ml-1">{resource.currency}</span>
                </div>

                <div className="font-body text-[14px] text-lex-navy">
                  {resource._count.purchases}
                  <span className="text-[11px] text-lex-slate ml-1">sold</span>
                </div>

                <div>
                  {resource.published ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-body text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lex-smoke text-lex-slate border border-lex-navy/10 font-body text-[11px] font-bold uppercase tracking-wider">
                      <XCircle size={12} /> Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Link href={`/resources/${resource.id}`} className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </Link>
                  <DeleteButton id={resource.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
