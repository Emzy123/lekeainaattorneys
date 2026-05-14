"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Settings,
  Scale,
  Menu,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  HelpCircle,
  FolderOpen
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Consultations", href: "/consultations", icon: MessageSquare },
    { name: "Resources", href: "/resources", icon: FolderOpen },
    { name: "Blog Posts", href: "/posts", icon: FileText },
    { name: "Practice Areas", href: "/practice-areas", icon: Briefcase },
    { name: "Team Members", href: "/team", icon: Users },
    { name: "Testimonials", href: "/testimonials", icon: Star },
    { name: "FAQs", href: "/faqs", icon: HelpCircle },
  ];

  return (
    <div className="flex min-h-screen bg-lex-content-area text-lex-navy font-body">
      {/* Sidebar */}
      <aside 
        className={`${collapsed ? 'w-[64px]' : 'w-[260px]'} bg-lex-obsidian border-r border-lex-obsidian/80 transition-all duration-normal ease-lex-standard hidden md:flex flex-col text-lex-smoke relative z-20`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 group overflow-hidden whitespace-nowrap">
              <Scale className="w-6 h-6 text-lex-gold flex-shrink-0" strokeWidth={2} />
              <span className="font-display font-bold text-xl tracking-wide text-white">
                LEX <span className="font-light">Admin</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Scale className="w-6 h-6 text-lex-gold mx-auto" strokeWidth={2} />
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center px-3 py-3 rounded-sm transition-colors duration-fast ${isActive ? 'bg-lex-gold/10 text-lex-gold border-r-2 border-lex-gold' : 'text-lex-smoke/70 hover:bg-white/5 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${!collapsed && 'mr-3'} ${isActive ? 'text-lex-gold' : ''}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap transition-opacity duration-fast ease-lex-standard">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-lex-smoke/50 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-sm">Collapse</span></div>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-lex-navy/10 flex items-center px-8 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-lex-navy p-2">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold font-display text-lex-navy">{navItems.find(i => i.href === pathname)?.name || 'Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/api/auth/signout" className="text-sm font-bold uppercase tracking-wider text-lex-slate hover:text-lex-navy transition-colors">
              Sign out
            </Link>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
