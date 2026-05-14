import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Download, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { verifyPurchase } from "../../actions/verify";

interface VerifyPageProps {
  searchParams: { reference?: string };
}

export default async function VerifyPaymentPage({ searchParams }: VerifyPageProps) {
  const paystackRef = searchParams.reference;

  if (!paystackRef) {
    redirect("/shop");
  }

  // Auto-verify on page load (server-side) — no manual refresh needed
  let result: Awaited<ReturnType<typeof verifyPurchase>> | null = null;
  let verifyError = false;

  try {
    result = await verifyPurchase(paystackRef);
  } catch {
    verifyError = true;
  }

  const isSuccess = result?.status === "success" || result?.status === "already_processed";
  const isFailed = verifyError || result?.status === "failed";

  return (
    <div className="bg-lex-smoke min-h-screen flex items-center justify-center py-24 px-6">
      <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-xl border border-lex-navy/5 text-center relative overflow-hidden">
        {/* Top accent bar */}
        <div
          className={`absolute top-0 left-0 w-full h-1.5 ${
            isSuccess ? "bg-emerald-500" : isFailed ? "bg-red-500" : "bg-lex-gold"
          }`}
        />

        {isSuccess && result ? (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-95 duration-normal">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h1 className="font-display text-[28px] font-bold text-lex-navy mb-2">
              Payment Successful
            </h1>
            <p className="font-body text-[14px] text-lex-slate mb-8 leading-relaxed">
              Your transaction was completed successfully. A receipt and download link have been
              sent to <strong>{result.buyerEmail}</strong>.
            </p>

            <div className="bg-lex-smoke/50 border border-lex-navy/10 rounded-sm p-4 text-left mb-8">
              <div className="font-body text-[11px] font-bold text-lex-slate uppercase tracking-wider mb-2">
                Order Details
              </div>
              <div className="font-display text-[15px] font-bold text-lex-navy mb-1">
                {result.resourceTitle}
              </div>
              <div className="font-body text-[12px] text-lex-slate">
                ₦{((result.amount ?? 0) / 100).toLocaleString()} · Ref: LEX-
                {result.reference?.slice(0, 8).toUpperCase()}
              </div>
            </div>

            {result.downloadUrl && (
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-lex-navy text-white font-body text-[13px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-lex-navy/90 transition-colors mb-4"
              >
                <Download size={16} /> Download Resource
              </a>
            )}

            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 text-lex-slate font-body text-[13px] hover:text-lex-navy transition-colors"
            >
              Browse more resources <ArrowRight size={14} />
            </Link>
          </>
        ) : isFailed ? (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} className="text-red-600" />
            </div>
            <h1 className="font-display text-[28px] font-bold text-lex-navy mb-2">
              Payment Failed
            </h1>
            <p className="font-body text-[14px] text-lex-slate mb-6 leading-relaxed">
              We could not verify your payment. Your card may not have been charged. If you
              believe this is an error, please contact support with your reference number.
            </p>
            <div className="font-body text-[12px] text-lex-slate/70 mb-8 bg-lex-smoke p-3 rounded-sm">
              Ref: <span className="font-mono">{paystackRef}</span>
            </div>
            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 bg-lex-navy text-white font-body text-[13px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-lex-navy/90 transition-colors"
            >
              Return to Shop <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          // Fallback — should not normally be reached since we await server-side
          <>
            <div className="w-16 h-16 bg-lex-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={32} className="text-lex-gold animate-spin" />
            </div>
            <h1 className="font-display text-[28px] font-bold text-lex-navy mb-2">
              Verifying Payment…
            </h1>
            <p className="font-body text-[14px] text-lex-slate mb-6 leading-relaxed">
              Confirming your transaction. Please wait.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
