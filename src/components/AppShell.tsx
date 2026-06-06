import { useEffect, useState, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TokenBadge } from "@/components/videos/TokenBadge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  Upload,
  Video,
  FolderOpen,
  LayoutTemplate,
  BarChart3,
  Megaphone,
  Monitor,
  Plus,
  Settings,
  Globe,
  ChevronDown,
  Check,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem =
  | { label: string; icon: LucideIcon; to: string; badge?: string; indent?: boolean }
  | { label: string; icon: LucideIcon; isGroup: true; badge?: string }
  | { sectionHeader: string };

const MIN_WIDTH = 1280;

function useIsTooNarrow() {
  const [isTooNarrow, setIsTooNarrow] = useState(() => window.innerWidth < MIN_WIDTH);
  useEffect(() => {
    const handler = () => setIsTooNarrow(window.innerWidth < MIN_WIDTH);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isTooNarrow;
}

export function AppShell({
  children,
  tokenBalance,
  spentTokens,
}: {
  children: ReactNode;
  tokenBalance?: number;
  spentTokens?: number;
}) {
  const isTooNarrow = useIsTooNarrow();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "tr" ? "tr" : "en";

  const navItems: NavItem[] = [
    { label: t("nav.dashboard"),        icon: LayoutDashboard, to: "/dashboard" },
    { label: t("nav.feedSources"),      icon: Database,        to: "/feed-sources" },
    { label: t("nav.exports"),          icon: Upload,          to: "/exports" },
    { sectionHeader: t("nav.aiStudio") },
    { label: t("nav.aiVideo"),          icon: Video,         isGroup: true, badge: t("nav.badgeNew") },
    { label: t("nav.newVideo"),         icon: Plus,          to: "/videos",              indent: true },
    { label: t("nav.library"),          icon: FolderOpen,    to: "/videos?view=library", indent: true },
    { label: t("nav.dynamicCreative"),  icon: LayoutTemplate, to: "/templates" },
    { label: t("nav.analytics"),        icon: BarChart3,     to: "/analytics" },
    { label: t("nav.metaAds"),          icon: Megaphone,     to: "/meta-ads" },
  ];

  const isNavItemActive = (to: string) => {
    const [pathname, search = ""] = to.split("?");
    if (pathname === "/videos") {
      const navView = new URLSearchParams(search).get("view");
      const currentView = new URLSearchParams(location.search).get("view");
      if (navView === "library") {
        return location.pathname === "/videos" && currentView === "library";
      }
      return location.pathname === "/videos" && currentView !== "library";
    }
    return location.pathname === pathname;
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-semibold tracking-tight text-primary-foreground">O</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">{t("shell.brand")}</span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navItems.map((item, i) =>
            "sectionHeader" in item ? (
              <p
                key={`header-${i}`}
                className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40"
              >
                {item.sectionHeader}
              </p>
            ) : "isGroup" in item ? (
              <div
                key={item.label}
                className="flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70"
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
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-white",
                  item.indent && "pl-7 text-xs",
                  isNavItemActive(item.to) && "bg-sidebar-accent text-white",
                )}
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
              </Link>
            ),
          )}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-1">
          {/* Language selector */}
          <div className="px-3 py-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    {currentLang.toUpperCase()}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-40">
                <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                  <span className="flex flex-1 items-center justify-between">
                    English
                    {currentLang === "en" && <Check className="h-3.5 w-3.5" />}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage("tr")}>
                  <span className="flex flex-1 items-center justify-between">
                    Türkçe
                    {currentLang === "tr" && <Check className="h-3.5 w-3.5" />}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {tokenBalance !== undefined && (
            <div className="px-3 py-1.5">
              <TokenBadge balance={tokenBalance} spent={spentTokens} />
            </div>
          )}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
              O
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{t("shell.user.name")}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{t("shell.user.email")}</p>
            </div>
            <Settings className="h-4 w-4 text-sidebar-foreground/70" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 md:pl-64">{children}</main>

      {/* Desktop-width blocker */}
      {isTooNarrow && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background px-8 text-center">
          <Monitor className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold text-foreground">
            {t("shell.tooNarrow.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("shell.tooNarrow.desc")}</p>
          <p className="text-xs text-muted-foreground/60">{t("shell.tooNarrow.hint")}</p>
        </div>
      )}
    </div>
  );
}
