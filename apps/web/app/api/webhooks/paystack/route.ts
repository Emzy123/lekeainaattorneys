import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@lex/database";

// Paystack sends webhook events as POST to this URL
// Register this URL in: https://dashboard.paystack.com/#/settings/webhooks
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  // 1. Verify signature
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const expectedSig = createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSig !== signature) {
    console.warn("Paystack webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse event
  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Handle charge.success
  if (event.event === "charge.success") {
    const txData = event.data as {
      reference: string;
      amount: number;
      currency: string;
      customer: { email: string };
      metadata?: { resourceId?: string };
    };

    const paystackRef = txData.reference;
    const buyerEmail = txData.customer?.email ?? "";
    const resourceId = txData.metadata?.resourceId;

    try {
      // Idempotency: skip if already COMPLETED
      const existing = await prisma.purchase.findFirst({
        where: { paystackReference: paystackRef },
      });

      if (existing?.status === "COMPLETED") {
        return NextResponse.json({ received: true, skipped: "already_completed" });
      }

      const resource = resourceId
        ? await prisma.resource.findUnique({ where: { id: resourceId } })
        : null;

      const downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      if (existing) {
        await prisma.purchase.update({
          where: { id: existing.id },
          data: {
            status: "COMPLETED",
            buyerEmail,
            paystackReference: paystackRef,
            downloadUrl: resource?.fileUrl ?? null,
            downloadExpiresAt,
            amount: txData.amount,
          },
        });
      } else if (resourceId) {
        await prisma.purchase.create({
          data: {
            resourceId,
            buyerEmail,
            amount: txData.amount,
            currency: txData.currency ?? "NGN",
            status: "COMPLETED",
            paystackReference: paystackRef,
            downloadUrl: resource?.fileUrl ?? null,
            downloadExpiresAt,
          },
        });
      }

      console.log(`✅ Webhook: Purchase completed for ref ${paystackRef}`);
    } catch (err) {
      console.error("Webhook DB error:", err);
      // Return 500 so Paystack retries
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // Always return 200 for events we don't handle (so Paystack doesn't retry them)
  return NextResponse.json({ received: true });
}
