'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ArrowUpRight, Shield, Coins, BarChart3, Search, Diamond, CreditCard } from 'lucide-react'
import Image from "next/image"
import { Typewriter } from "@/components/typewriter"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface FilterState {
  pool: ("invault" | "open")[];
  verified: boolean;
  size: ("small" | "large")[];
}

interface GoldPool {
  id: string;
  kg: number;
  rate: string;
  icon: string;
  dealer: string;
  verified: boolean;
  inVault: boolean;
}

const pools: GoldPool[] = [
  { id: "1", kg: 1000, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer A", verified: true, inVault: true },
  { id: "2", kg: 100, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer B", verified: true, inVault: false },
  { id: "3", kg: 250, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer C", verified: false, inVault: true },
  { id: "4", kg: 100, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer D", verified: true, inVault: false },
  { id: "5", kg: 24, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer E", verified: false, inVault: true },
  { id: "6", kg: 12.5, rate: "2335 STRK per 1.0drk", icon: "/placeholder.svg", dealer: "Dealer F", verified: true, inVault: false },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    pool: [],
    verified: false,
    size: [],
  })
  const [sort, setSort] = useState("popular")
  const [filteredPools, setFilteredPools] = useState<GoldPool[]>([])

  useEffect(() => {
    const getFilteredAndSortedPools = () => {
      const filtered = pools.filter(pool => {
        const matchesSearch = pool.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pool.kg.toString().includes(searchTerm);
        const matchesPool = filters.pool.length === 0 ||
          (filters.pool.includes('invault') && pool.inVault) ||
          (filters.pool.includes('open') && !pool.inVault);
        const matchesVerified = !filters.verified || pool.verified;
        const matchesSize = filters.size.length === 0 ||
          (filters.size.includes('small') && pool.kg < 100) ||
          (filters.size.includes('large') && pool.kg >= 100);

        return matchesSearch && matchesPool && matchesVerified && matchesSize;
      });

      return [...filtered].sort((a, b) => {
        switch (sort) {
          case "recent":
            return parseInt(b.id) - parseInt(a.id);
          case "price-high-to-low":
            return b.kg - a.kg;
          case "price-low-to-high":
            return a.kg - b.kg;
          default:
            return 0;
        }
      });
    };

    setFilteredPools(getFilteredAndSortedPools());
  }, [searchTerm, filters, sort]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 py-20 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            <Typewriter text="Welcome to Starkmine" />
          </h1>
          <h2 className="mb-6 text-2xl font-semibold text-orange-500 md:text-3xl">
            <Typewriter text="Revolutionizing Gold Trading on the Blockchain" delay={70} />
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
            <Typewriter
              text="Experience the future of gold investment with our innovative blockchain-based platform. Trade fractions of gold securely, efficiently, and transparently."
              delay={20}
            />
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              Start Trading
            </Button>
            <Button variant="outline" className="border-zinc-600 text-white hover:bg-zinc-700">
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/gold-pattern.jpg')] opacity-90 mix-blend-overlay"></div>
      </section>

      <div className="container my-6 mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <Sidebar
            className={`lg:w-64 lg:flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden lg:block'
              }`}
            onFilterChange={(newFilters: FilterState) => setFilters(newFilters)}
            onSortChange={setSort}
          />

          <main className="flex-1 py-8 lg:pl-8">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Available Gold Pools</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search pools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-zinc-800 border-zinc-700 text-white w-full"
                />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPools.map((pool) => (
                <Link href={`/nft/${pool.id}`} key={pool.id}>
                <Card className="group overflow-hidden bg-zinc-800 transition-transform hover:scale-105">
                  <div className="relative aspect-video">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 430 270"
                      preserveAspectRatio="xMidYMid slice"
                      className="absolute inset-0"
                    >
                      <defs>
                        <linearGradient id={`cardGradient-${pool.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFD700" />
                          <stop offset="50%" stopColor="#DAA520" />
                          <stop offset="100%" stopColor="#B8860B" />
                        </linearGradient>
                        <linearGradient id={`shimmer-${pool.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>
      
                      {/* Background with shimmer */}
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#cardGradient-${pool.id})`}
                      />
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#shimmer-${pool.id})`}
                        opacity="0.5"
                      >
                        <animate
                          attributeName="x"
                          from="-430"
                          to="430"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </rect>
      
                      {/* Weight overlay */}
                      <text
                        x="50%"
                        y="50%"
                        fontFamily="monospace"
                        fontSize="32"
                        fill="rgba(255,255,255,0.9)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        letterSpacing="0.1em"
                      >{`${pool.kg} KG`}</text>
                    </svg>
      
                    {/* Dealer badge src={pool.icon} */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-zinc-900">
                      <Image
                        src="/argent.svg"
                        alt={`${pool.dealer} logo`}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      {pool.dealer}
                    </div>
      
                    {/* Certification icon */}
                    <div className="absolute right-2 top-2">
                      <Diamond className="h-6 w-6 text-white/70" />
                    </div>
                  </div>
      
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-orange-500" />
                        <span className="text-lg font-bold text-white">Gold NFT</span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-400">
                        <ArrowUpRight className="h-5 w-5" />
                      </Button>
                    </div>
      
                    <div className="text-sm text-zinc-400">{pool.rate}</div>
      
                    <div className="mt-4 flex gap-2">
                      {pool.inVault && (
                        <span className="rounded-full bg-green-900/20 px-3 py-1 text-xs font-medium text-green-400">
                          INVAULT
                        </span>
                      )}
                      {pool.verified && (
                        <span className="rounded-full bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-400">
                          VERIFIED
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Page {currentPage} of 2</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[1, 2].map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
                  disabled={currentPage === 2}
                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose Starkmine?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-orange-500" />}
              title="Secure & Transparent"
              description="Our blockchain technology ensures every transaction is secure, verifiable, and immutable."
            />
            <FeatureCard
              icon={<Coins className="h-10 w-10 text-orange-500" />}
              title="Fractional Ownership"
              description="Invest in gold with as little or as much as you want, thanks to our fractional NFT system."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-orange-500" />}
              title="Real-time Market Data"
              description="Access up-to-the-minute gold prices and market trends to make informed decisions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="my-20 text-center">
        <div className="mx-auto mb-6 h-16 w-16 overflow-hidden rounded-full bg-gradient-to-b from-blue-500 to-blue-600">
          <Image
            src="/placeholder.svg"
            alt="Telegram Logo"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-orange-500">
          Start trading on Telegram
        </h2>
        <p className="mb-6 text-zinc-400">
          Use argent telegram for a seamless experience
        </p>
        <Button
          variant="outline"
          className="border-zinc-800 bg-transparent text-white hover:bg-zinc-800"
        >
          Launch in Telegram
        </Button>
      </div>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-zinc-800 p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </Card>
  )
}

