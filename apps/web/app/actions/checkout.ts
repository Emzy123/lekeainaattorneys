"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { prisma } from "@lex/database";

export async function initializeCheckout(formData: FormData) {
  const resourceId = formData.get("resourceId") as string;
  const email = formData.get("email") as string;

  if (!resourceId || !email) {
    throw new Error("Missing required fields");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  // 1. Securely validate resource and fetch price from DB (never trust client)
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource || !resource.published) {
    throw new Error("This resource is not currently available");
  }

  // 2. Initialize Paystack Transaction
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        // resource.price is stored in kobo (smallest unit) — send as-is
        amount: Math.round(resource.price),
        currency: resource.currency,
        // Redirect back to our verify page with the Paystack reference
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/verify`,
        metadata: {
          resourceId: resource.id,
          resourceTitle: resource.title,
          type: "premium_resource",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Paystack API Error:", data);
      throw new Error(data.message || "Payment initialization failed. Please try again.");
    }

    // 3. Redirect user to Paystack's secure hosted checkout page
    redirect(data.data.authorization_url);
  } catch (error: unknown) {
    // Re-throw Next.js redirect errors — they must propagate
    if (isRedirectError(error)) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Payment initialization failed";
    console.error("Checkout error:", message);
    throw new Error(message);
  }
}
