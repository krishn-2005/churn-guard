"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, Home, BarChart3, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home",      href: "/",          icon: Home     },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2a2a3c] bg-[#0a0a0f]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-100">
            Churn<span className="text-indigo-400">Guard</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === href
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-slate-400 hover:bg-[#1e1e2d] hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-[#1e1e2d] hover:text-slate-200 transition-colors md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#2a2a3c] bg-[#13131f] md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "text-slate-400 hover:bg-[#1e1e2d] hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5" />
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
