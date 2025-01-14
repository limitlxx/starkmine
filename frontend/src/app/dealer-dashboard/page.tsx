'use client'
 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Star } from 'lucide-react'
import Image from "next/image" 
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"

export default function DealerDashboard() { 

  const router = useRouter()
  const dealer = {
    name: "Golden Vault Inc.",
    avatar: "/placeholder.svg",
    kycStatus: "Verified",
    rating: 4.8,
    totalMinted: 1250,
    totalValue: 5000000,
    successfulTransactions: 985,
  }

  const mintedGolds = [
    { id: 'GOLD001', weight: '1000g', purity: '99.9%', status: 'Minted', claimable: true },
    { id: 'GOLD002', weight: '500g', purity: '99.9%', status: 'Minted', claimable: false },
    { id: 'GOLD003', weight: '250g', purity: '99.9%', status: 'Pending', claimable: false },
    { id: 'GOLD004', weight: '100g', purity: '99.9%', status: 'Minted', claimable: true },
  ]

  const transactions = [
    { id: 'TRX001', type: 'Mint', amount: '1000g', date: '2023-06-01', status: 'Completed' },
    { id: 'TRX002', type: 'Sale', amount: '500g', date: '2023-06-05', status: 'Completed' },
    { id: 'TRX003', type: 'Claim', amount: '250g', date: '2023-06-10', status: 'Pending' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
      
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={dealer.avatar}
              alt={dealer.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{dealer.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/20 text-green-500">
                  {dealer.kycStatus}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="mr-1 h-4 w-4 fill-current" />
                  <span>{dealer.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push('/mint-gold')} variant="outline" className="border-orange-700 text-white hover:bg-orange-800">
            Mint Gold
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minted</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dealer.totalMinted} g</div>
              <p className="text-xs text-zinc-500">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dealer.totalValue.toLocaleString()}</div>
              <p className="text-xs text-zinc-500">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Transactions</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dealer.successfulTransactions}</div>
              <p className="text-xs text-zinc-500">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 space-y-8">
          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle>Minted Golds</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Purity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mintedGolds.map((gold) => (
                    <TableRow key={gold.id}>
                      <TableCell>{gold.id}</TableCell>
                      <TableCell>{gold.weight}</TableCell>
                      <TableCell>{gold.purity}</TableCell>
                      <TableCell>
                        <Badge variant={gold.status === 'Minted' ? 'default' : 'secondary'}>
                          {gold.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={!gold.claimable}
                          className="border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-50"
                        >
                          Claim
                        </Button>
                      </TableCell>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

