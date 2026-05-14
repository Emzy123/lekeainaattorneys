"use server";

import { prisma } from "@lex/database";
import { revalidatePath } from "next/cache";

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  caseType: string;
  jurisdiction: string;
  brief: string;
  date?: string;
  time?: string;
}

export async function submitConsultation(formData: ConsultationFormData): Promise<{ success: boolean; reference: string }> {
  const { name, email, phone, caseType, jurisdiction, brief, date, time } = formData;

  if (!name || !email || !phone || !caseType || !jurisdiction || !brief) {
    throw new Error("All required fields must be filled in.");
  }

  try {
    const record = await prisma.consultationRequest.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        caseType,
        jurisdiction: jurisdiction.trim(),
        brief: brief.trim(),
        preferredDate: date || null,
        preferredTime: time || null,
        status: "NEW",
      },
    });

    revalidatePath("/consultations");

    // Optional: send notification email via Resend (non-blocking)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "LEX Platform <noreply@lexplatform.com>",
            to: [email],
            subject: `[LEX] Consultation Request Received — Ref: ${record.reference.slice(0, 8).toUpperCase()}`,
            html: `
              <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; color: #0d1b2a;">
                <div style="background: #0d1b2a; padding: 32px; text-align: center;">
                  <h2 style="color: #c9a84c; margin: 0; font-size: 28px; letter-spacing: 2px;">LEX</h2>
                </div>
                <div style="padding: 40px 32px;">
                  <h3 style="font-size: 22px; margin-bottom: 8px;">Dear ${name},</h3>
                  <p style="color: #5a6779; line-height: 1.7;">
                    Your consultation request has been securely received. A senior member of our intake team will review your matter and contact you within <strong>24 business hours</strong>.
                  </p>
                  <div style="background: #f4f4f0; border-left: 4px solid #c9a84c; padding: 16px 20px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #5a6779;">Your Reference Number</p>
                    <p style="margin: 4px 0 0; font-size: 22px; font-weight: bold; color: #0d1b2a; letter-spacing: 2px;">LEX-${record.reference.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <p style="color: #5a6779; font-size: 13px; line-height: 1.7;">
                    All communications are protected by attorney-client privilege and transmitted via TLS 1.3 encryption. Do not share your reference number with third parties.
                  </p>
                </div>
                <div style="background: #f4f4f0; padding: 20px 32px; text-align: center;">
                  <p style="color: #9ba5b4; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} LEX Platform. All rights reserved.</p>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
        // Non-fatal — we still return success
      }
    }

    return { success: true, reference: record.reference };
  } catch (error: any) {
    console.error("Failed to save consultation:", error);
    throw new Error("Failed to submit your request. Please try again.");
  }
}
