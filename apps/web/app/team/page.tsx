import { prisma } from "@lex/database";
import Link from "next/link";
import { Metadata } from 'next';
import { Search, SlidersHorizontal, Linkedin, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: 'Our Team | LEX Platform',
  description: 'Meet our team of exceptional legal professionals.',
};

export default async function TeamDirectoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    where: { 
      published: true,
      ...(searchQuery ? {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        }
      } : {})
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-lex-navy">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center text-[12px] font-body text-white/60 tracking-wider mb-6">
            <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-lex-gold font-semibold">Our Team</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-display text-[48px] md:text-[64px] font-bold text-white leading-tight">
                Our Legal Minds
              </h1>
              <p className="font-body text-[18px] text-white/80 mt-4">
                A collaborative ensemble of leading practitioners, bringing decades of decisive experience to complex corporate challenges.
              </p>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="w-full lg:w-[480px]">
              <form className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-lex-gold" />
                  </div>
                  <input 
                    type="text" 
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Search attorneys by name..." 
                    className="block w-full pl-12 pr-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-lex-gold focus:ring-0 transition-all font-body text-[14px]"
                  />
                </div>
                <button type="button" className="p-3 bg-white/10 border border-white/20 rounded-sm hover:bg-white/20 transition-colors text-white">
                  <SlidersHorizontal size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        {/* Active Filters (Mocked) */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <span className="font-body text-[12px] text-lex-slate uppercase tracking-widest font-bold">Active Filters:</span>
          {searchQuery && (
            <span className="bg-lex-navy/5 border border-lex-navy/10 text-lex-navy px-3 py-1 rounded-full font-body text-[12px] flex items-center gap-2">
              Name: {searchQuery}
            </span>
          )}
          {!searchQuery && (
            <span className="bg-lex-navy/5 border border-lex-navy/10 text-lex-navy px-3 py-1 rounded-full font-body text-[12px]">All Attorneys</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-lex-slate font-body text-[18px]">No team members found matching your criteria.</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="group cursor-pointer">
                <div className="aspect-square w-full mb-6 relative overflow-hidden rounded-md border-[3px] border-transparent group-hover:border-lex-gold transition-all duration-normal ease-lex-standard p-1">
                  <div className="w-full h-full bg-lex-silver rounded-sm overflow-hidden relative">
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
                
                {/* Mock Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-lex-navy text-white font-body text-[10px] font-bold uppercase px-2 py-1 rounded-full">Litigation</span>
                </div>
                
                <p className="font-body text-[14px] text-lex-slate line-clamp-3 mb-4">{member.bio || 'Experienced counsel providing strategic advice.'}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Link href={`/team/${member.id}`} className="font-body text-lex-navy font-bold uppercase tracking-[0.12em] text-[12px] group-hover:text-lex-gold transition-colors flex items-center gap-2">
                    View Profile <span className="text-lex-gold">→</span>
                  </Link>
                  {member.linkedin && (
                    <Link href={member.linkedin} target="_blank" className="text-lex-slate hover:text-lex-gold transition-colors">
                      <Linkedin size={18} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
