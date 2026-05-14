import { prisma } from "@lex/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchases | LEX Admin",
};

const statusColors: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: { resource: true },
  });

  const totalRevenue = purchases
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-normal">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold text-lex-navy">Purchases</h1>
          <p className="font-body text-[14px] text-lex-slate mt-1">
            All resource transactions
          </p>
        </div>
        <div className="bg-white border border-lex-navy/10 rounded-sm px-6 py-4 text-right shadow-sm">
          <div className="font-body text-[11px] font-bold uppercase tracking-widest text-lex-gold mb-1">
            Total Revenue
          </div>
          <div className="font-display text-[28px] font-bold text-lex-navy">
            ₦{(totalRevenue / 100).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-lex-navy/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-lex-smoke border-b border-lex-navy/10">
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Reference
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Resource
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Buyer Email
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Date
                </th>
                <th className="text-left px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-lex-slate">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lex-navy/5">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-lex-slate">
                    No purchases recorded yet.
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-lex-smoke/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[12px] text-lex-slate">
                      LEX-{purchase.reference.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-bold text-lex-navy max-w-[180px] truncate">
                      {purchase.resource.title}
                    </td>
                    <td className="px-6 py-4 text-lex-slate">{purchase.buyerEmail}</td>
                    <td className="px-6 py-4 font-bold text-lex-navy">
                      ₦{(purchase.amount / 100).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          statusColors[purchase.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-lex-slate text-[12px]">
                      {new Date(purchase.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {purchase.downloadUrl ? (
                        <a
                          href={purchase.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lex-gold font-bold text-[12px] uppercase tracking-wider hover:underline"
                        >
                          Link ↗
                        </a>
                      ) : (
                        <span className="text-lex-slate/40 text-[12px]">—</span>
                      )}
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
