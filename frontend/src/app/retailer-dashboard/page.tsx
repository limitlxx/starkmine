'use client'

import { useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Wallet, ArrowUpRight, ArrowDownRight, Search, Filter, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for the dashboard
const nftHoldings = [
  { id: 'NFT001', name: '1kg Gold Bar', quantity: 2, value: 120000 },
  { id: 'NFT002', name: '500g Gold Bar', quantity: 5, value: 150000 },
  { id: 'NFT003', name: '250g Gold Bar', quantity: 10, value: 150000 },
  { id: 'NFT004', name: '100g Gold Bar', quantity: 20, value: 120000 },
]

const recentTransactions = [
  { id: 'TRX001', type: 'Buy', amount: '1 NFT', value: '60000 STRK', date: '2023-06-01' },
  { id: 'TRX002', type: 'Sell', amount: '0.5 NFT', value: '30000 STRK', date: '2023-06-05' },
  { id: 'TRX003', type: 'Transfer', amount: '0.25 NFT', value: '15000 STRK', date: '2023-06-10' },
]

export default function RetailerDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const totalValue = nftHoldings.reduce((sum, nft) => sum + nft.value, 0)
  const totalQuantity = nftHoldings.reduce((sum, nft) => sum + nft.quantity, 0)

  const filteredNFTs = nftHoldings.filter(nft => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Retailer Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total NFT Value</CardTitle>
              <Wallet className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValue.toLocaleString()} STRK</div>
              <p className="text-xs text-zinc-500">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
              <BarChart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuantity}</div>
              <p className="text-xs text-zinc-500">Across {nftHoldings.length} types</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5,231 STRK</div>
              <p className="text-xs text-zinc-500">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Loss</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-1,124 STRK</div>
              <p className="text-xs text-zinc-500">-3.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>NFT Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    placeholder="Search NFTs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-zinc-700 bg-zinc-800 text-white">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 text-white">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem>Name</DropdownMenuItem>
                    <DropdownMenuItem>Quantity</DropdownMenuItem>
                    <DropdownMenuItem>Value</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-zinc-400">NFT</TableHead>
                    <TableHead className="text-right text-zinc-400">Quantity</TableHead>
                    <TableHead className="text-right text-zinc-400">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNFTs.map((nft) => (
                    <TableRow key={nft.id}>
                      <TableCell className="font-medium">{nft.name}</TableCell>
                      <TableCell className="text-right">{nft.quantity}</TableCell>
                      <TableCell className="text-right">{nft.value.toLocaleString()} STRK</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-400">Amount</TableHead>
                    <TableHead className="text-right text-zinc-400">Value</TableHead>
                    <TableHead className="text-right text-zinc-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Badge 
                          variant={tx.type === 'Buy' ? 'default' : tx.type === 'Sell' ? 'destructive' : 'secondary'}
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell className="text-right">{tx.value}</TableCell>
                      <TableCell className="text-right">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 text-white mb-8">
          <CardHeader>
            <CardTitle>Manage Your NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Buy NFTs
              </Button>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                Sell NFTs
              </Button>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                Transfer NFTs
              </Button>
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                View Transaction History
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

