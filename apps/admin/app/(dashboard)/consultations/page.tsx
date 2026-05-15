import { prisma } from "@lex/database";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle2, XCircle, Eye, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { setConsultationStatusFromForm } from "../../actions/consultations";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Consultations | LEX Admin' };

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NEW:       { label: 'New',       color: 'text-lex-gold',    bg: 'bg-lex-gold/10',    border: 'border-lex-gold/30' },
  REVIEWING: { label: 'Reviewing', color: 'text-blue-700',    bg: 'bg-blue-50',        border: 'border-blue-200' },
  SCHEDULED: { label: 'Scheduled', color: 'text-purple-700',  bg: 'bg-purple-50',      border: 'border-purple-200' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50',     border: 'border-emerald-200' },
  DECLINED:  { label: 'Declined',  color: 'text-red-700',     bg: 'bg-red-50',         border: 'border-red-200' },
};

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const filter = searchParams.status?.toUpperCase();

  const consultations = await prisma.consultationRequest.findMany({
    where: filter ? { status: filter as any } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const counts = await prisma.consultationRequest.groupBy({
    by: ['status'],
    _count: true,
  });

  const countMap = counts.reduce((acc: Record<string, number>, c) => {
    acc[c.status] = c._count;
    return acc;
  }, {} as Record<string, number>);

  const tabs = ['All', 'NEW', 'REVIEWING', 'SCHEDULED', 'COMPLETED', 'DECLINED'];

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-lex-navy/10 pb-6">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Consultation Inbox</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">
            Review and manage client consultation requests.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-lex-gold/10 border border-lex-gold/30 px-4 py-2 rounded-sm">
          <MessageSquare size={16} className="text-lex-gold" />
          <span className="font-body text-[13px] font-bold text-lex-navy">
            {countMap['NEW'] || 0} New
          </span>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const key = tab === 'All' ? undefined : tab;
          const isActive = filter === key || (tab === 'All' && !filter);
          const count = tab === 'All'
            ? consultations.length
            : countMap[tab] || 0;
          return (
            <Link
              key={tab}
              href={tab === 'All' ? '/consultations' : `/consultations?status=${tab.toLowerCase()}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-sm font-body text-[12px] font-bold uppercase tracking-widest transition-colors ${
                isActive
                  ? 'bg-lex-navy text-white'
                  : 'bg-white border border-lex-navy/10 text-lex-slate hover:border-lex-navy hover:text-lex-navy'
              }`}
            >
              {tab === 'All' ? 'All' : statusConfig[tab]?.label}
              <span className={`ml-1 rounded-full w-5 h-5 flex items-center justify-center text-[10px] ${isActive ? 'bg-white/20' : 'bg-lex-smoke'}`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_140px_180px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div>Client & Matter</div>
          <div>Case Type</div>
          <div>Date Received</div>
          <div>Status / Actions</div>
        </div>

        <div className="divide-y divide-lex-navy/5">
          {consultations.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No consultation requests found.
            </div>
          ) : (
            consultations.map((req) => {
              const sc = statusConfig[req.status] || statusConfig['NEW'];
              return (
                <div key={req.id} className="grid grid-cols-[1fr_160px_140px_180px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                  
                  {/* Client Info */}
                  <div className="pr-4">
                    <div className="font-display text-[15px] font-bold text-lex-navy">{req.name}</div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="font-body text-[12px] text-lex-slate flex items-center gap-1">
                        <Mail size={12} /> {req.email}
                      </span>
                      <span className="font-body text-[12px] text-lex-slate flex items-center gap-1">
                        <Phone size={12} /> {req.phone}
                      </span>
                      <span className="font-body text-[12px] text-lex-slate flex items-center gap-1">
                        <MapPin size={12} /> {req.jurisdiction}
                      </span>
                    </div>
                    <div className="font-body text-[12px] text-lex-slate/70 mt-1.5 italic line-clamp-1">&ldquo;{req.brief}&rdquo;</div>
                  </div>

                  {/* Case Type */}
                  <div>
                    <span className="inline-block bg-lex-navy/5 border border-lex-navy/10 text-lex-navy font-body text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {req.caseType}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 font-body text-[13px] text-lex-slate">
                    <Calendar size={14} className="text-lex-gold" />
                    {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] font-bold uppercase tracking-wider border w-fit ${sc.bg} ${sc.color} ${sc.border}`}>
                      {sc.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['REVIEWING', 'SCHEDULED', 'COMPLETED', 'DECLINED'] as const).map((s) => (
                        s !== req.status && (
                          <form key={s} action={setConsultationStatusFromForm}>
                            <input type="hidden" name="id" value={req.id} />
                            <input type="hidden" name="status" value={s} />
                            <button
                              type="submit"
                              title={`Mark as ${s}`}
                              className="font-body text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm bg-lex-smoke text-lex-slate hover:bg-lex-navy hover:text-white transition-colors"
                            >
                              {statusConfig[s].label}
                            </button>
                          </form>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
