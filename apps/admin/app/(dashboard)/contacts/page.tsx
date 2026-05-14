import { prisma } from "@lex/database";
import { Metadata } from "next";
import { Mail, Phone, Calendar, Clock, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Submissions | LEX Admin",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default async function ContactsPage() {
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const newCount = contacts.filter((c) => c.status === "NEW").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-normal">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold text-lex-navy">Inquiries</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">
            General contact form submissions
          </p>
        </div>
        <div className="bg-white border border-lex-navy/10 rounded-sm px-6 py-4 text-right shadow-sm flex items-center gap-4">
          <AlertCircle className="text-blue-500 w-8 h-8 opacity-20" />
          <div>
            <div className="font-body text-[11px] font-bold uppercase tracking-widest text-lex-slate mb-1">
              New Messages
            </div>
            <div className="font-display text-[28px] font-bold text-lex-navy leading-none">
              {newCount}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-lex-smoke border-b border-lex-navy/10">
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Sender
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Subject
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Date
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lex-navy/5">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-lex-slate">
                    No messages received yet.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-lex-smoke/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-lex-navy">{contact.name}</div>
                      <div className="text-[12px] text-lex-slate flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3" /> {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="text-[12px] text-lex-slate flex items-center gap-2 mt-0.5">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-lex-navy truncate">{contact.subject}</div>
                      <div className="text-[13px] text-lex-slate truncate mt-1">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColors[contact.status]}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-lex-slate">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(contact.createdAt).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1.5 mt-1"><Clock className="w-3 h-3" /> {new Date(contact.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-lex-gold font-bold text-[12px] uppercase tracking-wider hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
