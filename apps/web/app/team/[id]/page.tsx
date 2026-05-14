import { prisma } from "@lex/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';
import { ChevronRight, Linkedin, Download, MapPin, GraduationCap, Award, Briefcase, Mail, Phone } from "lucide-react";
import { Button } from "@lex/ui";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id }
  });
  
  if (!member) return { title: 'Attorney Not Found' };
  
  return {
    title: `${member.name} - ${member.title} | LEX Platform`,
    description: member.bio,
  };
}

export default async function AttorneyProfilePage({ params }: { params: { id: string } }) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id }
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-lex-smoke">
      {/* Split Layout Hero */}
      <section className="flex flex-col lg:flex-row min-h-[70vh] bg-lex-navy pt-[80px]">
        {/* Left: Edge-to-Edge Photo */}
        <div className="lg:w-[40%] relative min-h-[400px] lg:min-h-full order-2 lg:order-1 bg-lex-silver">
          {member.photo ? (
            <img src={member.photo} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale-[40%]" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-lex-slate text-white text-9xl font-display opacity-20">
              {member.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-lex-navy/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-lex-navy/80"></div>
        </div>

        {/* Right: Navy Content Panel */}
        <div className="lg:w-[60%] order-1 lg:order-2 flex flex-col justify-center px-8 lg:px-16 py-16 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-5"></div>
          <div className="relative z-10 max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center text-[12px] font-body text-white/60 tracking-wider mb-8">
              <Link href="/" className="hover:text-lex-gold transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <Link href="/team" className="hover:text-lex-gold transition-colors">Our Team</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-lex-gold font-semibold">{member.name}</span>
            </div>

            <h1 className="font-display text-[56px] md:text-[80px] font-black text-white leading-[1.05] mb-4">
              {member.name}
            </h1>
            <p className="font-body text-[16px] font-bold uppercase tracking-[0.2em] text-lex-gold mb-6">
              {member.title}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['Corporate Law', 'Commercial Litigation', 'Cross-Border Disputes'].map(tag => (
                <span key={tag} className="px-4 py-1.5 border border-lex-gold/30 rounded-full font-body text-[12px] font-bold uppercase tracking-wider text-lex-gold bg-lex-gold/5">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-12 border-t border-white/10 pt-8">
              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-body text-[14px]">
                  <Mail className="w-4 h-4 text-lex-gold" /> {member.email}
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-body text-[14px]">
                  <Linkedin className="w-4 h-4 text-lex-gold" /> LinkedIn Profile
                </a>
              )}
              <div className="flex items-center gap-2 text-white/80 font-body text-[14px]">
                <MapPin className="w-4 h-4 text-lex-gold" /> London Office
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 flex flex-col lg:flex-row gap-16">
        
        {/* Left: Biography & Details */}
        <div className="flex-1 space-y-16">
          {/* Bio */}
          <div>
            <h2 className="font-display text-[32px] font-bold text-lex-navy mb-6">Biography</h2>
            <div className="prose prose-lg max-w-none text-lex-slate font-body leading-relaxed">
              <p className="text-[18px] text-lex-navy font-medium mb-6">
                {member.bio || `${member.name} is a distinguished ${member.title.toLowerCase()} known for delivering exceptional results in complex legal matters.`}
              </p>
              <p>
                With over two decades of experience, they have built a reputation for relentless preparation, strategic foresight, and an unwavering commitment to client success. They regularly advise multinational corporations, financial institutions, and high-net-worth individuals on their most critical and sensitive matters.
              </p>
              <p>
                Prior to joining LEX, they served in prestigious roles that provided unique insights into the regulatory and judicial processes that shape our current legal landscape. This dual perspective—understanding both the enforcement and defense sides—allows for uniquely comprehensive counsel.
              </p>
            </div>
          </div>

          {/* Notable Cases */}
          <div>
            <h2 className="font-display text-[32px] font-bold text-lex-navy mb-8 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-lex-gold" />
              Representative Matters
            </h2>
            <div className="space-y-6">
              {[
                "Successfully defended a multinational technology firm in a $2B antitrust class action, achieving complete dismissal before trial.",
                "Lead counsel in the cross-border acquisition of a European logistics conglomerate, navigating complex regulatory approvals in 12 jurisdictions.",
                "Secured a landmark appellate victory redefining the scope of fiduciary duties for corporate directors in Delaware."
              ].map((caseText, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-[2px] bg-lex-gold/50 flex-shrink-0 mt-2"></div>
                  <p className="font-body text-[16px] text-lex-slate leading-relaxed">{caseText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-[24px] font-bold text-lex-navy mb-6 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-lex-gold" />
                Education
              </h3>
              <ul className="space-y-4 font-body text-[15px] text-lex-slate">
                <li className="flex flex-col">
                  <span className="font-bold text-lex-navy">J.D., Yale Law School</span>
                  <span>Magna Cum Laude, Yale Law Journal Editor</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-bold text-lex-navy">B.A., Oxford University</span>
                  <span>First Class Honours, PPE</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display text-[24px] font-bold text-lex-navy mb-6 flex items-center gap-3">
                <Award className="w-5 h-5 text-lex-gold" />
                Bar Admissions
              </h3>
              <ul className="space-y-3 font-body text-[15px] text-lex-slate">
                <li>State Bar of New York</li>
                <li>Solicitor, England & Wales</li>
                <li>U.S. Supreme Court</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[380px] space-y-8 lg:sticky lg:top-[100px] h-fit">
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button className="w-full bg-lex-navy text-white hover:bg-lex-navy/90 h-12 rounded-sm shadow-md flex items-center justify-center gap-2 font-bold tracking-widest text-[12px]">
              <Download className="w-4 h-4 text-lex-gold" />
              DOWNLOAD VCARD
            </Button>
            <Button className="w-full bg-white text-lex-navy border border-lex-navy/10 hover:border-lex-gold hover:text-lex-gold transition-colors h-12 rounded-sm flex items-center justify-center gap-2 font-bold tracking-widest text-[12px]">
              <Phone className="w-4 h-4" />
              DIRECT LINE
            </Button>
          </div>

          {/* Consultation Booking Widget */}
          <div className="bg-white border border-lex-navy/10 shadow-sm rounded-sm p-8">
            <h3 className="font-display text-[24px] font-bold text-lex-navy mb-2">Engage Counsel</h3>
            <p className="font-body text-[14px] text-lex-slate mb-6">Request a confidential consultation with {member.name.split(' ')[0]}.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Your Name</label>
                <input type="text" className="w-full bg-lex-smoke border-transparent focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[14px] p-3" />
              </div>
              <div>
                <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Corporate Email</label>
                <input type="email" className="w-full bg-lex-smoke border-transparent focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[14px] p-3" />
              </div>
              <div>
                <label className="block font-body text-[12px] font-bold uppercase tracking-wider text-lex-navy mb-2">Matter Briefing</label>
                <textarea rows={3} className="w-full bg-lex-smoke border-transparent focus:border-lex-gold focus:ring-0 rounded-sm font-body text-[14px] p-3 resize-none"></textarea>
              </div>
              <Button type="button" className="w-full bg-lex-gold text-lex-navy hover:bg-lex-gold-light mt-4 rounded-sm font-bold tracking-widest text-[14px] h-12">
                SUBMIT REQUEST
              </Button>
            </form>
            <p className="font-body text-[10px] text-lex-slate text-center mt-4 uppercase tracking-wider">All communications are strictly privileged.</p>
          </div>

        </aside>

      </section>
    </div>
  );
}
