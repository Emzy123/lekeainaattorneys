"use server";

import { prisma } from "@lex/database";
import { isRedirectError } from "next/dist/client/components/redirect";

export interface VerifyResult {
  status: "success" | "failed" | "already_processed";
  buyerEmail?: string;
  resourceTitle?: string;
  downloadUrl?: string;
  reference?: string;
  amount?: number;
}

export async function verifyPurchase(paystackRef: string): Promise<VerifyResult> {
  if (!paystackRef) {
    throw new Error("Missing payment reference.");
  }

  // Check if already processed (idempotency guard)
  const existing = await prisma.purchase.findFirst({
    where: { paystackReference: paystackRef },
    include: { resource: true },
  });

  if (existing?.status === "COMPLETED") {
    return {
      status: "already_processed",
      buyerEmail: existing.buyerEmail,
      resourceTitle: existing.resource.title,
      downloadUrl: existing.downloadUrl ?? undefined,
      reference: existing.reference,
      amount: existing.amount,
    };
  }

  // Verify with Paystack API
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(paystackRef)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status || data.data?.status !== "success") {
      // Payment failed or not yet confirmed — mark as FAILED
      if (existing) {
        await prisma.purchase.update({
          where: { id: existing.id },
          data: { status: "FAILED" },
        });
      }
      return { status: "failed" };
    }

    const txData = data.data;
    const metadata = txData.metadata ?? {};
    const resourceId: string = metadata.resourceId;
    const buyerEmail: string = txData.customer?.email ?? "";

    // Find the resource for the download URL
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return { status: "failed" };
    }

    const downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    let purchase;
    if (existing) {
      // Update existing pending purchase
      purchase = await prisma.purchase.update({
        where: { id: existing.id },
        data: {
          status: "COMPLETED",
          buyerEmail,
          paystackReference: paystackRef,
          downloadUrl: resource.fileUrl,
          downloadExpiresAt,
          amount: txData.amount, // amount in kobo from Paystack
        },
        include: { resource: true },
      });
    } else {
      // Create a new purchase record (first time we see this reference)
      purchase = await prisma.purchase.create({
        data: {
          resourceId,
          buyerEmail,
          amount: txData.amount,
          currency: txData.currency ?? "NGN",
          status: "COMPLETED",
          paystackReference: paystackRef,
          downloadUrl: resource.fileUrl,
          downloadExpiresAt,
        },
        include: { resource: true },
      });
    }

    // Send download email (non-blocking)
    if (process.env.RESEND_API_KEY) {
      sendDownloadEmail(
        buyerEmail,
        purchase.resource.title,
        resource.fileUrl,
        purchase.reference,
        purchase.amount
      ).catch((err) => console.error("Download email failed:", err));
    }

    return {
      status: "success",
      buyerEmail: purchase.buyerEmail,
      resourceTitle: purchase.resource.title,
      downloadUrl: resource.fileUrl,
      reference: purchase.reference,
      amount: purchase.amount,
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error;
    console.error("verifyPurchase error:", error);
    throw new Error("Verification failed. Please contact support.");
  }
}

async function sendDownloadEmail(
  to: string,
  resourceTitle: string,
  downloadUrl: string,
  reference: string,
  amountKobo: number
) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LEX Platform <noreply@lexplatform.com>",
      to: [to],
      subject: `[LEX] Your Download is Ready — ${resourceTitle}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; color: #0d1b2a;">
          <div style="background: #0d1b2a; padding: 32px; text-align: center;">
            <h2 style="color: #c9a84c; margin: 0; font-size: 28px; letter-spacing: 2px;">LEX</h2>
          </div>
          <div style="padding: 40px 32px;">
            <h3 style="font-size: 22px; margin-bottom: 8px;">Your purchase is confirmed.</h3>
            <p style="color: #5a6779; line-height: 1.7;">
              Thank you for your purchase of <strong>${resourceTitle}</strong>. Your download link is ready.
            </p>
            <div style="background: #f4f4f0; border-left: 4px solid #c9a84c; padding: 16px 20px; margin: 24px 0;">
              <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #5a6779;">Order Reference</p>
              <p style="margin: 4px 0 0; font-size: 18px; font-weight: bold; color: #0d1b2a; letter-spacing: 2px;">LEX-${reference.slice(0, 8).toUpperCase()}</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #5a6779;">Amount Paid: ₦${(amountKobo / 100).toLocaleString()}</p>
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${downloadUrl}" style="background: #0d1b2a; color: white; padding: 16px 32px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
                ⬇ Download Resource
              </a>
            </div>
            <p style="color: #9ba5b4; font-size: 12px; line-height: 1.7;">
              This download link is valid for 48 hours. Do not share it. All purchases are protected by our Terms of Service.
            </p>
          </div>
          <div style="background: #f4f4f0; padding: 20px 32px; text-align: center;">
            <p style="color: #9ba5b4; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} LEX Platform. All rights reserved.</p>
          </div>
        </div>
      `,
    }),
  });
}
