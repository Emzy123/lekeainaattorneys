import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, CheckCircle2, Linkedin, Trophy, Star, Shield, Award } from "lucide-react";
import { prisma } from "@lex/database";
import { Card, CardContent } from "@lex/ui";

export const metadata: Metadata = {
  title: "About Us | LEX Platform",
  description: "Learn about our firm's history, mission, and expert team.",
};

export default async function AboutPage() {
  const teamMembers = await prisma.teamMember.findMany({
    take: 4,
    orderBy: { order: 'asc' },
    where: { published: true }
  });

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">
      {/* 10.1 PAGE HERO */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col justify-center items-center text-center overflow-hidden bg-lex-navy pt-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-lex-navy via-lex-navy/80 to-lex-navy/60 z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 w-full">
          {/* Breadcrumb */}
          <div className="absolute top-0 left-6 sm:left-0 flex items-center text-[12px] font-body text-white/60 tracking-wider">
            <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-lex-gold font-semibold">About</span>
          </div>

          <h1 className="font-display text-[48px] md:text-[64px] font-bold text-white mt-12 animate-in fade-in slide-in-from-bottom-4 duration-slower ease-lex-enter">
            Our Firm
          </h1>
          
          <div className="w-24 h-[3px] bg-lex-gold mx-auto my-6 animate-in fade-in zoom-in-50 duration-normal delay-200"></div>
          
          <p className="font-body text-[18px] text-white/90 font-light max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-slower ease-lex-enter delay-300">
            A legacy of relentless advocacy, uncompromising standards, and delivering decisive results for global enterprises since 1994.
          </p>
        </div>
      </section>

      {/* 10.2 FIRM STORY - TIMELINE */}
      <section className="py-[120px] px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <span className="font-body font-bold text-[12px] tracking-[0.12em] text-lex-gold uppercase">Heritage</span>
          <h2 className="font-display text-[40px] font-bold tracking-tight text-lex-navy">The Firm Story</h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-lex-gold/30"></div>
          
          <div className="space-y-24">
            {/* Timeline Node 1 (Left) */}
            <div className="relative flex items-center justify-between w-full group">
              <div className="w-5/12 text-right pr-12 animate-in slide-in-from-left-8 fade-in duration-slow ease-lex-standard">
                <Card className="hover:border-lex-gold text-left ml-auto max-w-md inline-block shadow-lg">
                  <CardContent className="p-8">
                    <h4 className="font-display text-[22px] font-bold text-lex-navy mb-3">Foundation</h4>
                    <p className="font-body text-[16px] text-lex-slate leading-relaxed">
                      Established by former Supreme Court clerks with a singular vision: to provide uncompromising corporate litigation support.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-lex-gold border-4 border-lex-smoke shadow-md z-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-normal">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="w-5/12 pl-12 text-left animate-in slide-in-from-right-8 fade-in duration-slow ease-lex-standard">
                <span className="font-display text-[48px] font-black text-lex-gold/40 group-hover:text-lex-gold transition-colors duration-normal">1994</span>
              </div>
            </div>

            {/* Timeline Node 2 (Right) */}
            <div className="relative flex items-center justify-between w-full group">
              <div className="w-5/12 text-right pr-12 animate-in slide-in-from-left-8 fade-in duration-slow ease-lex-standard">
                <span className="font-display text-[48px] font-black text-lex-gold/40 group-hover:text-lex-gold transition-colors duration-normal">2005</span>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-lex-gold border-4 border-lex-smoke shadow-md z-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-normal">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="w-5/12 pl-12 text-left animate-in slide-in-from-right-8 fade-in duration-slow ease-lex-standard">
                <Card className="hover:border-lex-gold max-w-md inline-block shadow-lg">
                  <CardContent className="p-8">
                    <h4 className="font-display text-[22px] font-bold text-lex-navy mb-3">Global Expansion</h4>
                    <p className="font-body text-[16px] text-lex-slate leading-relaxed">
                      Opened major offices in London and Singapore, extending our reach to serve multinational clients across key jurisdictions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Timeline Node 3 (Left) */}
            <div className="relative flex items-center justify-between w-full group">
              <div className="w-5/12 text-right pr-12 animate-in slide-in-from-left-8 fade-in duration-slow ease-lex-standard">
                <Card className="hover:border-lex-gold text-left ml-auto max-w-md inline-block shadow-lg">
                  <CardContent className="p-8">
                    <h4 className="font-display text-[22px] font-bold text-lex-navy mb-3">Modern Infrastructure</h4>
                    <p className="font-body text-[16px] text-lex-slate leading-relaxed">
                      Deployed enterprise-grade digital infrastructure, standardising secure case management and remote counsel capabilities globally.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-lex-gold border-4 border-lex-smoke shadow-md z-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-normal">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="w-5/12 pl-12 text-left animate-in slide-in-from-right-8 fade-in duration-slow ease-lex-standard">
                <span className="font-display text-[48px] font-black text-lex-gold/40 group-hover:text-lex-gold transition-colors duration-normal">2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10.3 MISSION, VISION & VALUES */}
      <section className="relative py-[120px] px-6 w-full bg-lex-navy overflow-hidden">
        {/* Radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lex-slate/40 via-lex-navy to-lex-navy opacity-50 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white/5 border border-lex-gold/20 backdrop-blur-sm p-10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-normal">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-lex-gold"></div>
            <h3 className="font-display text-[30px] font-bold text-white mb-6">Mission</h3>
            <p className="font-body text-[16px] text-white/80 leading-relaxed">
              To defend our clients' most critical interests with relentless precision, combining profound legal intellect with uncompromising ethical standards.
            </p>
          </div>
          
          {/* Vision */}
          <div className="bg-white/5 border border-lex-gold/20 backdrop-blur-sm p-10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-normal">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-lex-gold"></div>
            <h3 className="font-display text-[30px] font-bold text-white mb-6">Vision</h3>
            <p className="font-body text-[16px] text-white/80 leading-relaxed">
              To remain the undisputed global standard in legal counsel, adapting to modern challenges while rooted in the highest traditions of the bar.
            </p>
          </div>
          
          {/* Values */}
          <div className="bg-white/5 border border-lex-gold/20 backdrop-blur-sm p-10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-normal">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-lex-gold"></div>
            <h3 className="font-display text-[30px] font-bold text-white mb-6">Values</h3>
            <ul className="space-y-4">
              {['Absolute Confidentiality', 'Relentless Preparation', 'Fiduciary Excellence', 'Strategic Innovation'].map((val, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lex-gold flex-shrink-0" />
                  <span className="font-body text-[16px] text-white/90">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 10.4 ATTORNEY PROFILES GRID */}
      <section className="py-[120px] px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="font-body font-bold text-[12px] tracking-[0.12em] text-lex-gold uppercase">Leadership</span>
            <h2 className="font-display text-[40px] font-bold tracking-tight text-lex-navy">Our Partners</h2>
          </div>
          <Link href="/team" className="font-body text-[14px] font-bold text-lex-navy uppercase tracking-widest border-b-2 border-lex-gold pb-1 hover:text-lex-gold transition-colors inline-flex items-center">
            View Full Team <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.length === 0 ? (
            <p className="text-lex-slate text-center col-span-4">No team members currently listed.</p>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="group cursor-pointer">
                <div className="aspect-square w-full mb-6 relative overflow-hidden rounded-md border-[3px] border-transparent group-hover:border-lex-gold transition-all duration-normal ease-lex-standard p-1">
                  <div className="w-full h-full bg-lex-silver rounded-sm overflow-hidden relative">
                    {/* Placeholder for Photo with greyscale reveal */}
                    <div className="absolute inset-0 bg-lex-navy/10 group-hover:bg-transparent transition-colors duration-normal z-10"></div>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-normal" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lex-slate text-white text-4xl font-display">{member.name.charAt(0)}</div>
                    )}
                  </div>
                </div>
                <h4 className="font-display text-[22px] font-bold text-lex-navy mb-1 group-hover:text-lex-gold transition-colors">{member.name}</h4>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-lex-gold mb-3">{member.title}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-lex-navy text-white font-body text-[10px] font-bold uppercase px-2 py-1 rounded-full">Corporate</span>
                  <span className="bg-lex-navy text-white font-body text-[10px] font-bold uppercase px-2 py-1 rounded-full">Litigation</span>
                </div>
                <p className="font-body text-[14px] text-lex-slate line-clamp-3 mb-4">{member.bio || 'Senior partner specializing in complex multi-jurisdictional matters.'}</p>
                <Link href={`/team/${member.id}`} className="text-lex-navy hover:text-lex-gold transition-colors inline-flex">
                  <Linkedin size={20} />
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 10.5 AWARDS & RECOGNITION */}
      <section className="py-[100px] border-t border-lex-navy/5 bg-lex-smoke overflow-hidden">
        <div className="text-center mb-12">
          <span className="font-body font-bold text-[12px] tracking-[0.12em] text-lex-gold uppercase">Recognition</span>
          <h2 className="font-display text-[32px] font-bold text-lex-navy mt-2">Global Awards</h2>
        </div>
        
        {/* CSS Marquee */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[1,2,3,4,5,6].map((i) => (
              <div key={`a-${i}`} className="mx-12 flex items-center justify-center w-40 h-20 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-normal cursor-pointer">
                {/* Mock Logo */}
                <div className="flex items-center gap-2 font-display text-2xl font-bold text-lex-navy">
                  <Trophy className="text-lex-gold" /> Award {i}
                </div>
              </div>
            ))}
          </div>
          <div className="animate-marquee flex whitespace-nowrap absolute top-0 group-hover:[animation-play-state:paused]">
             {[1,2,3,4,5,6].map((i) => (
              <div key={`b-${i}`} className="mx-12 flex items-center justify-center w-40 h-20 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-normal cursor-pointer">
                {/* Mock Logo */}
                <div className="flex items-center gap-2 font-display text-2xl font-bold text-lex-navy">
                  <Star className="text-lex-gold" /> Firm {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Required style for marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}
