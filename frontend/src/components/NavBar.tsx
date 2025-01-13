"use client";

// import { ModeToggle } from "./toggle";
import WalletBar from "./WalletBar";
import Image from "next/image";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { Righteous } from "next/font/google";
import { useState } from "react";
import logo from "../../public/starkmineLogo.jpeg";

const righteous = Righteous({ weight: ["400"], subsets: ["latin"] });

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-none z-30 px-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between py-4 relative">
        <div className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="logo icon"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1
            className={`text-xl sm:text-2xl md:text-3xl ${righteous.className} uppercase text-foreground`}
          >
            StarkMine
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors">
            <WalletBar />
          </div>
          {/* <ModeToggle /> */} mode
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X /> : <Menu className="h-6 w-6" />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-full max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-lg py-4 px-6 md:hidden">
            <div className="space-y-4">
              <div className="bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors">
                <WalletBar />
              </div>
              <div className="flex justify-end">{/* <ModeToggle /> */}mode</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
