import { Metadata } from 'next';
import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter, Input } from "@lex/ui";
import { prisma } from "@lex/database";
import { initializeCheckout } from "../actions/checkout";

export const metadata: Metadata = {
  title: 'Premium Legal Resources | LEX Platform',
  description: 'Purchase enterprise-grade legal templates and playbooks.',
};

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="py-24 px-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Premium Resources</h1>
      <p className="text-xl text-gray-600 mb-12">Enterprise-grade legal templates, directly to your inbox.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.length === 0 ? (
          <p className="text-gray-500">No resources available.</p>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <p className="text-2xl font-bold mt-2">
                  {resource.currency} {(resource.price / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600 mb-6">
                  {resource.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0 border-t bg-gray-50/50 flex-col gap-4 items-start p-6">
                <form action={initializeCheckout} className="w-full flex flex-col gap-3">
                  <input type="hidden" name="resourceId" value={resource.id} />
                  <div className="w-full space-y-1">
                    <label htmlFor={`email-${resource.id}`} className="text-xs font-semibold text-gray-500 uppercase">
                      Delivery Email
                    </label>
                    <Input 
                      id={`email-${resource.id}`}
                      type="email" 
                      name="email" 
                      placeholder="you@company.com" 
                      required 
                      className="bg-white"
                    />
                  </div>
                  <Button className="w-full py-6 text-md mt-2 shadow-md">Purchase & Download</Button>
                </form>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
