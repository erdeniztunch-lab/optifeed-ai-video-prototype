import { ReactNode } from "react";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Database,
  Upload,
  Video,
  LayoutTemplate,
  BarChart3,
  Megaphone,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Feed Sources", icon: Database, to: "/feed-sources" },
  { label: "Exports", icon: Upload, to: "/exports" },
  { label: "Videos", icon: Video, to: "/videos", badge: "New" },
  { label: "Dynamic Templates", icon: LayoutTemplate, to: "/templates" },
  { label: "GA4 Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Meta Ads", icon: Megaphone, to: "/meta-ads" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Optifeed</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
              activeClassName="bg-sidebar-accent text-white"
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/90">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">Anna Chen</p>
              <p className="truncate text-xs text-sidebar-foreground/70">acme.com</p>
            </div>
            <Settings className="h-4 w-4 text-sidebar-foreground/70" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
