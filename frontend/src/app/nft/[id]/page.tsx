'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" 
import { Footer } from "@/components/footer" 
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { BuySellModal } from "@/components/buy-sell-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceChart } from "@/components/price-chart"
import { RelatedNFTs } from "@/components/related-nfts"
import { Header } from "@/components/header";


export default function NFTDetail() {
  // const [view, setView] = useState<'preview' | 'code'>('preview')
  const [isBuySellOpen, setIsBuySellOpen] = useState(false)

  const stats = [
    { label: "Weight", value: "250 g" },
    { label: "Purity", value: "99.9%" },
    { label: "Unit", value: "g" },
    { label: "Priced", value: "23/01/2025" },
    { label: "Total Supply", value: "33/100 dArk" },
    { label: "Status", value: "Open" },
    { label: "InVault", value: "Yes" },
    { label: "Verified", value: "Yes" },
    { label: "Total Pool", value: "64,342.788 STRK" },
    { label: "Cost per fraction", value: "8 STRK" },
  ]

  const transactions = [
    {
      id: "0x562...D9C8c4",
      amount: "+2.874",
      currency: "STRK",
      timestamp: "02 - 01 - 2024 - 12 PM",
      type: "buy"
    },
    {
      id: "0x123...A7B9e2",
      amount: "-1.523",
      currency: "STRK",
      timestamp: "01 - 01 - 2024 - 3 PM",
      type: "sell"
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-zinc-500">Starkmine-737509907478458</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-white">250 Gram Gold NFT</h1>
              <p className="text-zinc-400">
                This NFT represents 250 grams of 99.9% pure gold, securely stored and fully backed. Each fraction of this NFT corresponds to real, physical gold, offering a digital gateway to precious metal ownership.
              </p>
            </div>

            <Tabs defaultValue="preview" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="rounded-lg bg-zinc-900 p-4">
                <div className="aspect-square w-full max-w-[400px] mx-auto">
                  <Image
                    src="/placeholder.svg"
                    alt="Gold NFT Preview"
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              </TabsContent>
              <TabsContent value="code">
                <pre className="rounded-lg bg-zinc-900 p-4 overflow-x-auto">
                  <code className="text-sm text-white">
                            {`{
                            "name": "250 Gram Gold NFT",
                            "description": "This NFT represents 250 grams of 99.9% pure gold",
                            "image": "ipfs://...",
                            "attributes": [
                                {
                                "trait_type": "Weight",
                                "value": "250g"
                                },
                                {
                                "trait_type": "Purity",
                                "value": "99.9%"
                                }
                            ]
                            }`}
                  </code>
                </pre>
              </TabsContent>
            </Tabs>

            <Card className="mb-8 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Price Chart</h2>
              <PriceChart />
            </Card>

            <Card className="mb-8 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Transaction History</h2>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div>
                      <div className="text-sm text-zinc-400">{tx.id}</div>
                      <div className="text-white">{tx.timestamp}</div>
                    </div>
                    <div className={`text-lg font-semibold ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'buy' ? '+' : '-'}{tx.amount} {tx.currency}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="mb-8 bg-zinc-900 p-6 sticky top-4">
              <h2 className="mb-4 text-xl font-bold text-white">NFT Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                    <div className="font-medium text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-6 w-full bg-orange-500 py-6 text-lg font-bold text-white hover:bg-orange-600"
                onClick={() => setIsBuySellOpen(true)}
              >
                BUY / SELL
              </Button>
            </Card>

            <Card className="bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Vault Information</h2>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-zinc-400">Vault Name</div>
                  <div className="font-medium text-white">SecureGold Vault</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Location</div>
                  <div className="font-medium text-white">Zurich, Switzerland</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Security</div>
                  <div className="font-medium text-white">24/7 armed guards, biometric access</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Insurance</div>
                  <div className="font-medium text-white">Fully insured by Lloyd&apos;s of London</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <RelatedNFTs />
      </main>

      <Footer />

      <BuySellModal
        isOpen={isBuySellOpen}
        onClose={() => setIsBuySellOpen(false)}
        nft={{
          id: "250-gram-gold",
          name: "250 Gram Gold NFT",
          image: "/placeholder.svg",
          weight: "250g",
          purity: "99.9%",
          pricePerFraction: 8,
          totalSupply: 100,
          availableFractions: 67,
        }}
      />
    </div>
  )
}

