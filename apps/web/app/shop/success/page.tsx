import Link from "next/link";
import { CheckCircle2, Download, ChevronRight, FileText } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Purchase Successful | LEX Platform',
};

export default function PurchaseSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke items-center justify-center py-24 px-6 relative overflow-hidden">
      
      {/* Mock Confetti Background (CSS based) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
         <div className="absolute top-[10%] left-[20%] w-3 h-3 bg-lex-gold rotate-45 animate-pulse"></div>
         <div className="absolute top-[30%] right-[25%] w-4 h-4 bg-lex-navy rounded-full animate-bounce"></div>
         <div className="absolute bottom-[20%] left-[30%] w-2 h-8 bg-lex-gold rotate-12"></div>
         <div className="absolute top-[40%] left-[10%] w-3 h-3 bg-emerald-500 rounded-full"></div>
         <div className="absolute bottom-[40%] right-[15%] w-4 h-4 bg-lex-navy rotate-45"></div>
      </div>

      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-2xl p-8 md:p-12 max-w-[600px] w-full relative z-10 text-center animate-in slide-in-from-bottom-8 fade-in duration-normal">
        
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-[4px] border-emerald-100">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>

        <h1 className="font-display text-[32px] md:text-[40px] font-bold text-lex-navy leading-tight mb-4">
          Payment Successful
        </h1>
        <p className="font-body text-[16px] text-lex-slate mb-8">
          Thank you for your purchase. A receipt has been sent to your email address. You can access your premium legal resource immediately below.
        </p>

        {/* Order Summary */}
        <div className="bg-lex-smoke rounded-sm p-6 text-left mb-8 border border-lex-navy/5">
           <h3 className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-slate border-b border-lex-navy/10 pb-3 mb-4">Order Summary</h3>
           <div className="flex items-start gap-4">
             <div className="w-16 h-20 bg-lex-navy rounded-sm flex items-center justify-center flex-shrink-0">
               <FileText size={24} className="text-lex-gold" />
             </div>
             <div>
               <div className="font-display text-[18px] font-bold text-lex-navy mb-1">Corporate Structuring Master Playbook</div>
               <div className="font-body text-[12px] text-lex-slate uppercase tracking-wider mb-2">Order ID: LEX-8849-2A</div>
               <div className="font-display text-[20px] font-bold text-lex-navy">$249.00</div>
             </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button className="w-full bg-lex-gold text-lex-navy hover:bg-lex-gold-light font-body text-[14px] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
            <Download size={18} /> Download Resource (PDF)
          </button>
          
          <Link href="/shop" className="w-full bg-transparent text-lex-navy hover:bg-lex-smoke border border-lex-navy/10 font-body text-[14px] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center gap-2">
            Browse More Resources <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
