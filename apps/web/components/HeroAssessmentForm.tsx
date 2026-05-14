"use client";

import { useTransition, useState } from "react";
import { submitConsultation } from "../actions/consultation";
import { Button } from "@lex/ui";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function HeroAssessmentForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [refCode, setRefCode] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: "Not provided (Quick Form)", // Default since it's missing from hero form
      caseType: fd.get("caseType") as string,
      jurisdiction: "Not specified", // Default
      brief: "Quick assessment request from homepage hero.", // Default
    };

    if (!data.name || !data.email || !data.caseType) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const res = await submitConsultation(data);
        if (res.success) {
          setRefCode(res.reference);
          setSuccess(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Submission failed.");
      }
    });
  }

  if (success) {
    return (
      <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 p-8 rounded-sm shadow-2xl border-t-[3px] border-t-emerald-500 text-center animate-in fade-in duration-normal">
        <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
        <h3 className="font-display text-[24px] font-bold text-white mb-2">Request Received</h3>
        <p className="font-body text-[14px] text-white/70 mb-6">
          Our intake team will contact you shortly.
        </p>
        <div className="bg-lex-navy/40 border border-white/10 p-4 rounded-sm">
          <span className="block font-body text-[10px] uppercase tracking-widest text-white/50 mb-1">Reference No.</span>
          <span className="font-mono text-[18px] text-white tracking-widest">LEX-{refCode.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-[20px] border border-white/20 p-8 rounded-sm shadow-2xl border-t-[3px] border-t-lex-gold relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-lex-gold/10 rounded-full blur-2xl"></div>
      
      <h3 className="font-display text-[30px] font-bold text-white mb-2">Free Case Assessment</h3>
      <p className="font-body text-[14px] text-white/70 mb-6">Confidential. Secure. No obligation.</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-white/90 text-[13px] font-body rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            name="name"
            required
            type="text" 
            placeholder="Full Name" 
            className="w-full bg-lex-navy/40 border border-white/10 text-white placeholder:text-white/50 px-4 py-3 rounded-sm font-body text-[16px] focus:outline-none focus:border-lex-gold transition-colors" 
          />
        </div>
        <div>
          <input 
            name="email"
            required
            type="email" 
            placeholder="Business Email" 
            className="w-full bg-lex-navy/40 border border-white/10 text-white placeholder:text-white/50 px-4 py-3 rounded-sm font-body text-[16px] focus:outline-none focus:border-lex-gold transition-colors" 
          />
        </div>
        <div>
          <select 
            name="caseType"
            required
            defaultValue=""
            className="w-full bg-lex-navy/40 border border-white/10 text-white/70 px-4 py-3 rounded-sm font-body text-[16px] focus:outline-none focus:border-lex-gold transition-colors appearance-none"
          >
            <option value="" disabled>Select Matter Type</option>
            <option value="corporate">Corporate Litigation</option>
            <option value="family">Family Law</option>
            <option value="criminal">Criminal Defense</option>
            <option value="intellectual-property">Intellectual Property</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full mt-2" 
          size="lg"
        >
          {isPending ? <><Loader2 size={18} className="animate-spin mr-2" /> Processing…</> : "Get Free Assessment"}
        </Button>
      </form>
    </div>
  );
}
