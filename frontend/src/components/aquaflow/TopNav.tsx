"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Waves, Search, Bell, User, Menu, X, ChevronDown, Check,
  ExternalLink, Droplets, MapPin, ArrowRight
} from "lucide-react";
import { WaterService } from "../../services/waterService";
import { DEMO_NOTIFICATIONS, DamInfo } from "../../data/aquaFlowConfig";

export function TopNav() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    dams: DamInfo[];
    canals: { name: string; details: string; link: string }[];
  }>({ dams: [], canals: [] });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const res = await WaterService.searchInfrastructure(val);
      setSearchResults(res);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/#dashboard" },
    { name: "Dams", href: "/dams" },
    { name: "Canals", href: "/canals" },
    { name: "Analytics", href: "/analytics" },
    { name: "Weather", href: "/weather" },
    { name: "About", href: "/about" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0B192C]">
            Jal<span className="text-blue-600">dhar</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 font-semibold bg-blue-50/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div ref={searchRef} className="relative hidden sm:block w-48 md:w-56 lg:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dams, canals..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setIsSearchOpen(true)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-100/90 border border-slate-200/80 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[11px] font-semibold uppercase text-slate-400 px-3 py-1 tracking-wider">
                  Dams & Reservoirs
                </div>
                {searchResults.dams.length > 0 ? (
                  searchResults.dams.map((dam) => (
                    <Link
                      key={dam.id}
                      href={`/dams?id=${dam.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50/70 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        <div>
                          <p className="text-xs font-medium text-slate-800 group-hover:text-blue-600">{dam.name}</p>
                          <p className="text-[10px] text-slate-400">{dam.location}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {dam.currentStorageTmc} TMC
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 px-3 py-1">No matching dams</p>
                )}

                <div className="text-[11px] font-semibold uppercase text-slate-400 px-3 pt-2 pb-1 tracking-wider border-t border-slate-100 mt-1">
                  Canal Networks
                </div>
                {searchResults.canals.length > 0 ? (
                  searchResults.canals.map((c, i) => (
                    <Link
                      key={i}
                      href={c.link}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50/70 transition-colors group"
                    >
                      <div>
                        <p className="text-xs font-medium text-slate-800 group-hover:text-blue-600">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.details}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 px-3 py-1">No matching canals</p>
                )}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.unread ? "bg-blue-50/60 border-l-2 border-blue-500" : "bg-slate-50 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-blue-400/40 focus:outline-none transition-all"
              aria-label="User profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                AG
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">Andhra Pradesh WRD</p>
                  <p className="text-[11px] text-slate-400">Chief Hydrology Engineer</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                  >
                    Dam Monitoring Console
                  </Link>
                  <Link
                    href="/reports"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                  >
                    Water Discharge Reports
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                  >
                    Sensor Calibration
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dams, canals..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
