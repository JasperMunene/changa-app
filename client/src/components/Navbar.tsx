"use client";
import React, { useState } from "react";
import { Search, Menu, X, MoveRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50   md:bg-gradient-to-b from-black/50 to-transparent border-b md:border-none ${
        isOpen ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop and Mobile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <h1
                className={`text-3xl font-bold ${
                  isOpen ? "text-emerald-600" : "text-[#E6F5F0]"
                }`}
              >
                Changa
              </h1>
            </Link>
            <Link
              href="/campaigns"
              className="hidden md:block text-[#E6F5F0]/90 hover:text-[#E6F5F0] transition-colors text-xl font-semibold pr-4 mt-2"
            >
              Explore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-8">
            <div className="max-w-md w-full">
              <form className="relative" onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#E6F5F0]" />
                <Input
                  placeholder="Search campaigns"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 bg-white/30 border-white text-[#E6F5F0] placeholder:text-[#E6F5F0] 
                  focus:bg-white/15 focus:text-white focus:placeholder:text-gray-100"
                />
              </form>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#E6F5F0]/90">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="hover:text-[#E6F5F0] hover:bg-white/10"
                    >
                      Login
                    </Button>
                  </SignInButton>
                  <span className="text-[#E6F5F0]/50">/</span>
                  <SignUpButton mode="modal">
                    <Button
                      variant="ghost"
                      className="hover:text-[#E6F5F0] hover:bg-white/10"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-transparent border-emerald-600 border-2 hover:bg-emerald-600 text-[#E6F5F0] p-3"
              >
                <Link href="/create-campaign">START A CAMPAIGN</Link>
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                isOpen ? "text-emerald-600" : "text-[#E6F5F0]"
              }`}
            >
              {isOpen ? <X size={30} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white/95 border-t border-gray-500 p-4 space-y-4">
            <form className="relative mb-4" onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search campaigns"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 bg-gray-100 border-gray-300 text-gray-700 placeholder:text-gray-800 focus:bg-gray-200 focus:text-gray-900 focus:placeholder:text-gray-500"
              />
            </form>

            <Link
              href="/campaigns"
              className="p-2 text-gray-900 hover:text-[#E6F5F0] transition-colors text-4xl flex justify-between font-bold"
              onClick={() => setIsOpen(false)}
            >
              <span>Explore</span>
              <MoveRight className="mt-3" />
            </Link>

            <div className="space-y-3 mt-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:text-[#E6F5F0] hover:bg-white/10"
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:text-[#E6F5F0] hover:bg-white/10"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="w-full bg-emerald-600 text-[#E6F5F0] hover:bg-emerald-500"
              >
                START A CAMPAIGN
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
