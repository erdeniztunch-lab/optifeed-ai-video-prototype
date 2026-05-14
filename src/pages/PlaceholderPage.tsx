import { type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <AppShell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Yakında
        </span>
      </div>
    </AppShell>
  );
}
