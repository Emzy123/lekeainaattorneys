import { prisma } from "@lex/database";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@lex/ui";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { reference?: string };
}) {
  const reference = searchParams.reference;

  if (!reference) {
    return (
      <div className="py-32 px-8 flex justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>No payment reference provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/resources">
              <Button className="w-full">Return to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check the database to see if the webhook has processed this reference yet
  const purchase = await prisma.purchase.findFirst({
    where: { paystackReference: reference },
    include: { resource: true }
  });

  return (
    <div className="py-32 px-8 flex justify-center min-h-[60vh] bg-gray-50">
      <Card className="max-w-lg w-full text-center shadow-lg border-none">
        <CardHeader className="space-y-4">
          {purchase && purchase.status === "COMPLETED" ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <CardTitle className="text-3xl text-gray-900">Payment Successful!</CardTitle>
              <CardDescription className="text-lg">
                Thank you for purchasing <strong>{purchase.resource.title}</strong>.
              </CardDescription>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <CardTitle className="text-3xl text-gray-900">Processing Payment</CardTitle>
              <CardDescription className="text-lg">
                We are waiting for confirmation from Paystack. Please hold on or check your email in a few minutes.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="pt-6 border-t mt-4">
          {purchase && purchase.status === "COMPLETED" && purchase.downloadUrl ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-sm text-green-800">
                  Your secure download link has been generated and is valid for 24 hours. A copy has also been sent to your email.
                </p>
              </div>
              <a href={purchase.downloadUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="w-full py-6 text-lg bg-[#D4AF37] text-black hover:bg-[#FBE18D]">
                  Download Your Resource
                </Button>
              </a>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Refresh Status
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
