import { prisma } from "@lex/database";
import { Edit2, PlusCircle, CheckCircle2, XCircle, Users } from "lucide-react";
import Link from "next/link";
import { deleteTeamMember } from "../../actions/cms";

export const metadata = { title: 'Team | LEX Admin' };

async function DeleteMemberButton({ id }: { id: string }) {
  const action = deleteTeamMember.bind(null, id);
  return (
    <form action={action}>
      <button type="submit" className="p-2 text-lex-slate hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Remove">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    </form>
  );
}

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-lex-navy/10 pb-6 gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Team Members</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage attorney profiles displayed on the public site.</p>
        </div>
        <Link href="/team/new" className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors whitespace-nowrap">
          <PlusCircle size={16} /> Add Member
        </Link>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_200px_120px_100px] items-center p-4 bg-lex-navy text-white font-body text-[12px] font-bold uppercase tracking-wider">
          <div></div>
          <div>Name & Title</div>
          <div>Contact</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-lex-navy/5">
          {members.length === 0 ? (
            <div className="p-12 text-center text-lex-slate font-body text-[14px]">
              No team members yet. Click &ldquo;Add Member&rdquo; to begin.
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="grid grid-cols-[60px_1fr_200px_120px_100px] items-center p-4 hover:bg-lex-smoke/30 transition-colors border-l-4 border-transparent hover:border-lex-gold group">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-lex-navy flex items-center justify-center text-lex-gold font-display font-bold text-lg flex-shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                {/* Name */}
                <div className="pr-4">
                  <div className="font-display text-[16px] font-bold text-lex-navy">{member.name}</div>
                  <div className="font-body text-[12px] text-lex-gold font-semibold uppercase tracking-wider mt-0.5">{member.title}</div>
                  <div className="font-body text-[12px] text-lex-slate mt-1 line-clamp-1">{member.bio}</div>
                </div>

                {/* Contact */}
                <div className="font-body text-[13px] text-lex-slate space-y-0.5">
                  {member.email && <div>{member.email}</div>}
                  {member.linkedin && <div className="text-blue-600 truncate">{member.linkedin}</div>}
                  {!member.email && !member.linkedin && <span className="italic text-lex-slate/50">No contact info</span>}
                </div>

                {/* Status */}
                <div>
                  {member.published ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-body text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lex-smoke text-lex-slate border border-lex-navy/10 font-body text-[11px] font-bold uppercase tracking-wider">
                      <XCircle size={12} /> Hidden
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/team/${member.id}`} className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </Link>
                  <DeleteMemberButton id={member.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
