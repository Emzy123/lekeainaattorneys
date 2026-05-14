"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateResource } from "../../../actions/resources";
import { prisma } from "@lex/database";

// This is a server component wrapper — Next.js will call the default export with params
export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const resource = await prisma.resource.findUnique({ where: { id: params.id } });

  if (!resource) {
    return (
      <div className="text-center py-24">
        <h2 className="font-display text-[28px] font-bold text-lex-navy">Resource not found</h2>
        <Link href="/resources" className="font-body text-lex-gold mt-4 inline-block">← Back to Resources</Link>
      </div>
    );
  }

  return <EditResourceForm resource={resource} />;
}

function EditResourceForm({ resource }: { resource: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: resource.title,
    description: resource.description,
    fileUrl: resource.fileUrl,
    price: (resource.price / 100).toString(),
    currency: resource.currency,
    fileType: resource.fileType,
    published: resource.published,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await updateResource(resource.id, {
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        price: Math.round(parseFloat(form.price) * 100),
        currency: form.currency,
        fileType: form.fileType,
        published: publish,
      });
      router.push("/resources");
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
        <Link href="/resources" className="p-2 text-lex-slate hover:text-lex-gold hover:bg-lex-gold/5 rounded-sm transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Edit Resource</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1 font-mono">/{resource.slug}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-sm font-body text-[14px]">{error}</div>
      )}

      <form className="bg-white rounded-sm border border-lex-navy/10 shadow-sm p-8 space-y-6">
        <div>
          <label className={labelCls}>Title</label>
          <input type="text" className={inputCls} value={form.title} onChange={e => update('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea rows={4} className={inputCls + " resize-none"} value={form.description} onChange={e => update('description', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>File URL / Download Link</label>
          <input type="url" className={inputCls} value={form.fileUrl} onChange={e => update('fileUrl', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Price (main unit)</label>
            <input type="number" min="0" step="0.01" className={inputCls} value={form.price} onChange={e => update('price', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <select className={inputCls} value={form.currency} onChange={e => update('currency', e.target.value)}>
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>File Type</label>
          <select className={inputCls} value={form.fileType} onChange={e => update('fileType', e.target.value)}>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="ZIP">ZIP</option>
          </select>
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
