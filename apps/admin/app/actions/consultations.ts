"use server";

import { prisma } from "@lex/database";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function updateConsultationStatus(id: string, status: string, notes?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const updated = await prisma.consultationRequest.update({
      where: { id },
      data: {
        status: status as any,
        notes: notes ?? undefined,
      },
    });
    revalidatePath("/consultations");
    return { success: true, record: updated };
  } catch (error) {
    throw new Error("Failed to update consultation status.");
  }
}

/** Form action wrapper for progressive enhancement (Next.js expects FormData). */
export async function setConsultationStatusFromForm(formData: FormData) {
  const id = formData.get("id") as string | null;
  const status = formData.get("status") as string | null;
  if (!id || !status) throw new Error("Missing consultation id or status.");
  await updateConsultationStatus(id, status);
}

export async function deleteConsultation(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.consultationRequest.delete({ where: { id } });
    revalidatePath("/consultations");
  } catch {
    throw new Error("Failed to delete consultation.");
  }
}
