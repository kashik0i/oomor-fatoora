"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <main className="min-h-[70svh] flex items-center">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Create and send invoices in minutes
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A fast, internationalized invoicing tool with PDF and CSV/XLSX/XML exports.
          Start free, upgrade when you need more.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="auth">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="signup">Create an account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
