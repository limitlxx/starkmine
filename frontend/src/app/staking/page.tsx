'use client'

import { useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StakingPage() {
  const [lendAmount, setLendAmount] = useState<number>(0)
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)

  const nfts = [
    { id: 'NFT001', name: '1kg Gold Bar', value: 60000 },
    { id: 'NFT002', name: '500g Gold Bar', value: 30000 },
    { id: 'NFT003', name: '250g Gold Bar', value: 15000 },
  ]

  const stakingPools = [
    { id: 'POOL1', name: 'High Yield', apy: '12%', totalStaked: '1,000,000 STRK', minLock: '30 days' },
    { id: 'POOL2', name: 'Balanced', apy: '8%', totalStaked: '2,500,000 STRK', minLock: '14 days' },
    { id: 'POOL3', name: 'Flexible', apy: '4%', totalStaked: '5,000,000 STRK', minLock: '1 day' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Staking & Lending</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>Your Staking Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span>Total Staked:</span>
                  <span className="font-bold">50,000 STRK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Borrowed:</span>
                  <span className="font-bold">10,000 STRK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available to Borrow:</span>
                  <span className="font-bold">40,000 STRK</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>Lending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lend-amount">Amount to Lend (STRK)</Label>
                  <Input
                    id="lend-amount"
                    type="number"
                    value={lendAmount}
                    onChange={(e) => setLendAmount(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label>Select NFT Collateral</Label>
                  <div className="grid gap-2">
                    {nfts.map((nft) => (
                      <Button
                        key={nft.id}
                        variant={selectedNFT === nft.id ? "default" : "outline"}
                        className={`justify-between ${
                          selectedNFT === nft.id ? "bg-orange-500 text-white" : "bg-zinc-800 text-white"
                        }`}
                        onClick={() => setSelectedNFT(nft.id)}
                      >
                        <span>{nft.name}</span>
                        <span>{nft.value} STRK</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  Lend STRK
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle>Staking Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-zinc-400">Pool</TableHead>
                  <TableHead className="text-zinc-400">APY</TableHead>
                  <TableHead className="text-zinc-400">Total Staked</TableHead>
                  <TableHead className="text-zinc-400">Min. Lock Period</TableHead>
                  <TableHead className="text-zinc-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakingPools.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell className="font-medium">{pool.name}</TableCell>
                    <TableCell>{pool.apy}</TableCell>
                    <TableCell>{pool.totalStaked}</TableCell>
                    <TableCell>{pool.minLock}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-zinc-800 text-white hover:bg-zinc-700">
                            Stake
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 text-white">
                          <DialogHeader>
                            <DialogTitle>Stake in {pool.name} Pool</DialogTitle>
                            <DialogDescription>
                              Enter the amount of STRK you want to stake in this pool.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="stake-amount" className="text-right">
                                Amount
                              </Label>
                              <Input
                                id="stake-amount"
                                type="number"
                                className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Enter STRK amount"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="lock-period" className="text-right">
                                Lock Period
                              </Label>
                              <div className="col-span-3">
                                <Slider
                                  id="lock-period"
                                  max={365}
                                  step={1}
                                  defaultValue={[30]}
                                  className="bg-zinc-800"
                                />
                                <div className="mt-2 text-sm text-zinc-400">30 days</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button className="bg-orange-500 text-white hover:bg-orange-600">
                              Confirm Stake
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

