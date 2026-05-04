"use client";

import Button from "@/components/ui/button/Button";

export default function PrintButton({ label = "Cetak" }: { label?: string }) {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
