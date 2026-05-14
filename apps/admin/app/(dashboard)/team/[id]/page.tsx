"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateTeamMember } from "../../../actions/cms";
import { prisma } from "@lex/database";

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await prisma.teamMember.findUnique({ where: { id: params.id } });

  if (!member) {
    return (
      <div className="text-center py-24">
        <h2 className="font-display text-[28px] font-bold text-lex-navy">Member not found</h2>
        <Link href="/team" className="font-body text-lex-gold mt-4 inline-block">← Back to Team</Link>
      </div>
    );
  }

  return <EditTeamMemberForm member={member} />;
}

function EditTeamMemberForm({ member }: { member: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: member.name,
    title: member.title,
    bio: member.bio,
    email: member.email || "",
    linkedin: member.linkedin || "",
    published: member.published,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await updateTeamMember(member.id, {
        ...form,
        published: publish,
      });
      router.push("/team");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-lex-smoke border border-lex-navy/10 focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[15px] px-4 py-3 text-lex-navy placeholder:text-lex-slate/50 outline-none transition-colors";
  const labelCls = "block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-normal">
      <div className="flex items-center gap-4 mb-8 border-b border-lex-navy/10 pb-6">
        <Link href="/team" className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Edit Team Member</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Update details for {member.name}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-sm font-body text-[14px]">{error}</div>
      )}

      <form className="bg-white rounded-sm border border-lex-navy/10 shadow-sm p-8 space-y-6">
        <div>
          <label className={labelCls}>Name</label>
          <input type="text" className={inputCls} value={form.name} onChange={e => update('name', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Title</label>
          <input type="text" className={inputCls} value={form.title} onChange={e => update('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Bio</label>
          <textarea rows={4} className={inputCls + " resize-none"} value={form.bio} onChange={e => update('bio', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input type="url" className={inputCls} value={form.linkedin} onChange={e => update('linkedin', e.target.value)} />
          </div>
        </div>
      </form>

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting} className="px-6 py-3 border border-lex-navy/20 text-lex-navy font-body text-[13px] font-bold uppercase tracking-widest rounded-sm hover:border-lex-navy transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting} className="flex-1 bg-lex-gold text-lex-navy hover:bg-lex-gold-light font-body text-[13px] font-bold uppercase tracking-widest py-3 rounded-sm transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
}
