"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createResource } from "../../../actions/resources";

export default function NewResourcePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    price: "",
    currency: "NGN",
    fileType: "PDF",
    published: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await createResource({
        title: form.title,
        description: form.description,
        fileUrl: form.fileUrl,
        price: Math.round(parseFloat(form.price) * 100), // store in kobo/cents
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
          <h1 className="font-display text-[28px] font-bold text-lex-navy">Add New Resource</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">Create a premium downloadable legal resource for the shop.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-sm font-body text-[14px]">
          {error}
        </div>
      )}

      <form className="bg-white rounded-sm border border-lex-navy/10 shadow-sm p-8 space-y-6">
        <div>
          <label className={labelCls}>Title</label>
          <input type="text" className={inputCls} placeholder="e.g. M&A Due Diligence Playbook 2024" value={form.title} onChange={e => update('title', e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea rows={4} className={inputCls + " resize-none"} placeholder="A comprehensive overview of what the buyer receives..." value={form.description} onChange={e => update('description', e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>File URL / Download Link</label>
          <input type="url" className={inputCls} placeholder="https://cdn.example.com/files/playbook.pdf" value={form.fileUrl} onChange={e => update('fileUrl', e.target.value)} required />
          <p className="font-body text-[12px] text-lex-slate mt-2">Paste the Cloudinary/S3 URL of the document file.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Price (in main currency unit)</label>
            <input type="number" min="0" step="0.01" className={inputCls} placeholder="5000.00" value={form.price} onChange={e => update('price', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <select className={inputCls} value={form.currency} onChange={e => update('currency', e.target.value)}>
              <option value="NGN">NGN — Nigerian Naira</option>
              <option value="USD">USD — US Dollar</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>File Type</label>
          <select className={inputCls} value={form.fileType} onChange={e => update('fileType', e.target.value)}>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="ZIP">ZIP (Bundle)</option>
          </select>
        </div>
      </form>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
          className="px-6 py-3 border border-lex-navy/20 text-lex-navy font-body text-[13px] font-bold uppercase tracking-widest rounded-sm hover:border-lex-navy transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="flex-1 bg-lex-gold text-lex-navy hover:bg-lex-gold-light font-body text-[13px] font-bold uppercase tracking-widest py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish to Shop'}
        </button>
      </div>
    </div>
  );
}
