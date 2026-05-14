"use server";

import { prisma } from "@lex/database";
import { revalidatePath } from "next/cache";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(
  formData: ContactFormData
): Promise<{ success: boolean }> {
  const { name, email, phone, subject, message } = formData;

  if (!name || !email || !subject || !message) {
    throw new Error("All required fields must be filled in.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: "NEW",
      },
    });

    revalidatePath("/admin/contacts");

    // Send confirmation email (non-blocking)
    if (process.env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "LEX Platform <noreply@lexplatform.com>",
          to: [email],
          subject: `[LEX] We've received your message`,
          html: `
            <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; color: #0d1b2a;">
              <div style="background: #0d1b2a; padding: 32px; text-align: center;">
                <h2 style="color: #c9a84c; margin: 0; font-size: 28px; letter-spacing: 2px;">LEX</h2>
              </div>
              <div style="padding: 40px 32px;">
                <h3 style="font-size: 22px; margin-bottom: 8px;">Dear ${name},</h3>
                <p style="color: #5a6779; line-height: 1.7;">
                  Thank you for reaching out. We have received your message regarding <strong>${subject}</strong> and a member of our team will respond within 1–2 business days.
                </p>
                <p style="color: #5a6779; font-size: 13px; line-height: 1.7; margin-top: 24px;">
                  For urgent legal matters, please call us directly at <strong>+1 (800) LEX-FIRM</strong>.
                </p>
              </div>
              <div style="background: #f4f4f0; padding: 20px 32px; text-align: center;">
                <p style="color: #9ba5b4; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} LEX Platform. All rights reserved.</p>
              </div>
            </div>
          `,
        }),
      }).catch((err) => console.error("Contact email failed:", err));
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("submitContact error:", error);
    throw new Error("Failed to submit your message. Please try again.");
  }
}
