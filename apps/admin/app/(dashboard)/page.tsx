import React from 'react';
import { prisma } from "@lex/database";
import { 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  PlusCircle,
  FolderOpen,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | LEX Admin',
};

export default async function AdminDashboardPage() {
  const totalPosts = await prisma.blogPost.count();
  const totalConsultations = await prisma.consultationRequest.count();
  
  const purchases = await prisma.purchase.aggregate({
    _sum: { amount: true },
    where: { status: "COMPLETED" }
  });
  const revenueKobo = purchases._sum.amount || 0;
  
  const pendingReviews = await prisma.consultationRequest.count({
    where: { status: "REVIEWING" }
  });

  const kpis = [
    { title: "Total Blog Posts", value: totalPosts.toString(), trend: "Active", isUp: true, icon: FileText },
    { title: "Consultation Requests", value: totalConsultations.toString(), trend: "All Time", isUp: true, icon: MessageSquare },
    { title: "Resource Revenue", value: `₦${(revenueKobo / 100).toLocaleString()}`, trend: "Total", isUp: true, icon: CreditCard },
    { title: "Pending Reviews", value: pendingReviews.toString(), trend: "Action Required", isUp: false, icon: Clock },
  ];

  const recentConsultations = await prisma.consultationRequest.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const recentPurchases = await prisma.purchase.findMany({ take: 3, orderBy: { createdAt: 'desc' }, include: { resource: true } });

  const recentActivity = [
    ...recentConsultations.map(c => ({
      id: `c-${c.id}`,
      type: 'consultation',
      desc: `New consultation request: ${c.caseType}`,
      time: new Date(c.createdAt).toLocaleDateString(),
      icon: MessageSquare,
      color: 'text-lex-gold',
      border: 'border-lex-gold',
      date: c.createdAt
    })),
    ...recentPurchases.map(p => ({
      id: `p-${p.id}`,
      type: 'purchase',
      desc: `Resource purchase: ${p.resource.title}`,
      time: new Date(p.createdAt).toLocaleDateString(),
      icon: CreditCard,
      color: 'text-emerald-600',
      border: 'border-emerald-600',
      date: p.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-normal">
      
      {/* 20.1 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-lex-navy/10 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <span className="font-body text-[12px] font-bold uppercase tracking-widest text-lex-gold">{kpi.title}</span>
               <kpi.icon className="w-8 h-8 text-lex-gold/80" />
            </div>
            
            <div className="flex items-end justify-between">
              <div className="font-display text-[32px] font-bold text-lex-navy leading-none">{kpi.value}</div>
              <div className={`flex items-center text-[14px] font-body font-bold ${kpi.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {kpi.trend}
              </div>
            </div>

            {/* Mock Sparkline Chart */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-60 transition-opacity">
               <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                 <path d="M0,30 L0,15 Q10,5 20,20 T40,10 T60,25 T80,5 L100,10 L100,30 Z" fill="var(--lex-gold)" opacity="0.2" />
                 <path d="M0,15 Q10,5 20,20 T40,10 T60,25 T80,5 L100,10" fill="none" stroke="var(--lex-gold)" strokeWidth="2" />
               </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 20.2 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-sm border border-lex-navy/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-[18px] font-bold text-lex-navy">Website Traffic <span className="font-body text-[14px] font-normal text-lex-slate ml-2">— 30 Days</span></h3>
            <div className="flex items-center gap-2 text-lex-slate text-[12px] font-body uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> This Month
            </div>
          </div>
          
          <div className="w-full h-[240px] relative border-b border-l border-lex-navy/5 flex items-end">
            {/* Mock Y-Axis */}
            <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-[10px] text-lex-slate font-body py-2">
              <span>10k</span><span>7.5k</span><span>5k</span><span>2.5k</span><span>0</span>
            </div>
            {/* Mock X-Axis */}
            <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[10px] text-lex-slate font-body px-2">
              <span>1st</span><span>8th</span><span>15th</span><span>22nd</span><span>30th</span>
            </div>
            
            {/* Mock Line Chart Area */}
            <div className="w-full h-[80%] relative overflow-hidden">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                 <path d="M0,100 L0,80 Q10,90 20,60 T40,40 T60,50 T80,20 L100,10 L100,100 Z" fill="var(--lex-gold)" opacity="0.15" />
                 <path d="M0,80 Q10,90 20,60 T40,40 T60,50 T80,20 L100,10" fill="none" stroke="var(--lex-navy)" strokeWidth="3" />
               </svg>
            </div>
          </div>
        </div>

        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-sm border border-lex-navy/10 p-6 shadow-sm flex flex-col">
          <h3 className="font-display text-[18px] font-bold text-lex-navy mb-6">Consultations by Practice Area</h3>
          
          <div className="flex-1 flex items-center justify-center relative">
            {/* Mock Donut */}
            <div className="w-48 h-48 rounded-full border-[24px] border-lex-smoke relative">
               <div className="absolute inset-[-24px] rounded-full border-[24px] border-lex-gold" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}></div>
               <div className="absolute inset-[-24px] rounded-full border-[24px] border-lex-navy" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }}></div>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="font-display text-[24px] font-bold text-lex-navy">{totalConsultations}</span>
                 <span className="font-body text-[10px] uppercase tracking-wider text-lex-slate">Total</span>
               </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
             <div className="flex items-center gap-2 font-body text-[12px] text-lex-slate">
               <div className="w-3 h-3 bg-lex-gold rounded-full"></div> Corporate (45%)
             </div>
             <div className="flex items-center gap-2 font-body text-[12px] text-lex-slate">
               <div className="w-3 h-3 bg-lex-navy rounded-full"></div> Litigation (30%)
             </div>
             <div className="flex items-center gap-2 font-body text-[12px] text-lex-slate">
               <div className="w-3 h-3 bg-lex-smoke border border-lex-navy/20 rounded-full"></div> Other (25%)
             </div>
          </div>
        </div>
      </div>

      {/* 20.3 Recent Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Activity Feed (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-lex-navy/5">
            <h3 className="font-display text-[18px] font-bold text-lex-navy">Recent Activity</h3>
          </div>
          <div className="divide-y divide-lex-navy/5">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`p-4 flex items-center gap-4 hover:bg-lex-smoke/50 transition-colors border-l-4 ${activity.border} group`}>
                <div className={`w-10 h-10 rounded-full bg-lex-smoke flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[14px] text-lex-navy truncate">{activity.desc}</p>
                  <p className="font-body text-[12px] text-lex-slate">{activity.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[12px] font-body font-bold uppercase tracking-wider text-lex-gold bg-lex-gold/10 px-3 py-1.5 rounded-sm">
                  View
                </button>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="p-8 text-center text-lex-slate font-body text-[14px]">
                No recent activity.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-sm border border-lex-navy/10 p-6 shadow-sm">
          <h3 className="font-display text-[18px] font-bold text-lex-navy mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/posts/new" className="w-full flex items-center gap-3 p-4 border border-lex-navy/10 rounded-sm hover:border-lex-gold hover:text-lex-gold transition-colors text-lex-navy font-body font-bold text-[14px]">
              <PlusCircle className="w-5 h-5" /> New Blog Post
            </Link>
            <Link href="/resources/new" className="w-full flex items-center gap-3 p-4 border border-lex-navy/10 rounded-sm hover:border-lex-gold hover:text-lex-gold transition-colors text-lex-navy font-body font-bold text-[14px] text-left">
              <FolderOpen className="w-5 h-5" /> New Resource
            </Link>
            <Link href="/consultations" className="w-full flex items-center gap-3 p-4 border border-lex-navy/10 rounded-sm hover:border-lex-gold hover:text-lex-gold transition-colors text-lex-navy font-body font-bold text-[14px]">
              <MessageSquare className="w-5 h-5" /> View Consultations
            </Link>
            <Link href="/brand" className="w-full flex items-center gap-3 p-4 border border-lex-navy/10 rounded-sm hover:border-lex-gold hover:text-lex-gold transition-colors text-lex-navy font-body font-bold text-[14px]">
              <Settings className="w-5 h-5" /> Edit Brand Identity
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
