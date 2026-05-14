import { prisma } from "@lex/database";
import { Edit2, Trash2, PlusCircle, GripVertical, Mail, Linkedin } from "lucide-react";
import Link from "next/link";

export default async function TeamManagerPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-lex-navy/10 pb-6 gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Team Directory</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Manage attorney profiles and public biographies.</p>
        </div>
        <button className="flex items-center gap-2 bg-lex-gold text-lex-navy font-body text-[12px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-lex-gold-light transition-colors">
          <PlusCircle size={16} /> Add Attorney
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-sm border border-lex-navy/10 shadow-sm">
            <p className="text-lex-slate font-body text-[14px]">No team members defined. Click "Add Attorney" to begin.</p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-sm border border-lex-navy/10 shadow-sm p-6 relative group hover:border-lex-gold transition-colors">
              
              {/* Drag Handle */}
              <div className="absolute top-4 left-4 text-lex-slate/30 group-hover:text-lex-slate cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {member.published ? (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm font-body text-[10px] font-bold uppercase tracking-wider">Active</span>
                ) : (
                  <span className="px-2 py-1 bg-lex-smoke text-lex-slate border border-lex-navy/10 rounded-sm font-body text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                )}
              </div>

              <div className="flex flex-col items-center text-center mt-4">
                {/* Photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-lex-smoke border-2 border-lex-navy/5 mb-4 shadow-sm">
                   {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-lex-slate text-white text-2xl font-display font-bold">{member.name.charAt(0)}</div>
                  )}
                </div>
                
                {/* Details */}
                <h3 className="font-display text-[20px] font-bold text-lex-navy leading-tight mb-1">{member.name}</h3>
                <p className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-gold mb-4">{member.title}</p>
                
                {/* Contact Icons */}
                <div className="flex items-center gap-3 text-lex-slate mb-6">
                  {member.email && <Mail size={16} className="hover:text-lex-navy cursor-pointer transition-colors" />}
                  {member.linkedin && <Linkedin size={16} className="hover:text-lex-navy cursor-pointer transition-colors" />}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full pt-4 border-t border-lex-navy/10">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-lex-slate hover:text-lex-navy hover:bg-lex-smoke rounded-sm transition-colors font-body text-[12px] font-bold uppercase tracking-wider">
                    <Edit2 size={14} /> Edit
                  </button>
                  <div className="w-px h-4 bg-lex-navy/10"></div>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-lex-slate hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors font-body text-[12px] font-bold uppercase tracking-wider">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
