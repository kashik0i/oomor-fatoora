// App area: authenticated workspace (placeholder until auth guard is added)
// Renders the existing invoice main for now

import { InvoiceMain } from "@/app/components";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppHome({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/auth`);
  }
  return (
    <main className="py-10 lg:container">
      <InvoiceMain />
    </main>
  );
}
