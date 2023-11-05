import { Send } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Send className="text-primary" />
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
