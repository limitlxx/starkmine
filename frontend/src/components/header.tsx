"use client"
import WalletBar from "./walletbar";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LayoutDashboard, BookOpen, HelpCircle, User } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/starkmine-logo.svg"
            alt="Starkmine Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold text-white">STARKMINE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
            Pools
          </Link>
          <Link href="/staking" className="text-zinc-300 hover:text-white transition-colors">
            Lending
          </Link>
          <Link href="/governance" className="text-zinc-300 hover:text-white transition-colors">
            Governance
          </Link>
          <Link href="/docs" className="text-zinc-300 hover:text-white transition-colors">
            Docs
          </Link>
        </nav>
        <div className="flex items-center gap-4">
        <div className="bg-orange-600 rounded-xl text-white hover:bg-orange-700 transition-colors">
            <WalletBar />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-800 text-white border-zinc-700">
              <DropdownMenuItem asChild>
                <Link href="/dealer-dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Become a Dealer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/retailer-dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/docs" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ThemeToggle />
                <span className="ml-2">Toggle theme</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

