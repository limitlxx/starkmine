'use client'

import { useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Progress } from "@/components/ui/progress"

export default function GovernancePage() {
  const [newProposal, setNewProposal] = useState({ title: '', description: '' })

  const proposals = [
    { id: 'PROP1', title: 'Increase Staking Rewards', status: 'Active', votesFor: 75, votesAgainst: 25 },
    { id: 'PROP2', title: 'Add New Gold Pool', status: 'Pending', votesFor: 60, votesAgainst: 40 },
    { id: 'PROP3', title: 'Reduce Transaction Fees', status: 'Closed', votesFor: 80, votesAgainst: 20 },
  ]

  const handleCreateProposal = () => {
    console.log('Creating new proposal:', newProposal)
    // Here you would typically send this data to your backend
    setNewProposal({ title: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Governance</h1>

        <Card className="bg-zinc-900 text-white mb-8">
          <CardHeader>
            <CardTitle>Create New Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="proposal-title">Proposal Title</Label>
                <Input
                  id="proposal-title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="proposal-description">Proposal Description</Label>
                <Textarea
                  id="proposal-description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={4}
                />
              </div>
              <Button 
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleCreateProposal}
              >
                Submit Proposal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle>Active Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-zinc-400">Proposal</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Votes</TableHead>
                  <TableHead className="text-zinc-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">{proposal.title}</TableCell>
                    <TableCell>{proposal.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={proposal.votesFor} className="w-[100px]" />
                        <span className="text-sm text-zinc-400">
                          {proposal.votesFor}% For
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-zinc-800 text-white hover:bg-zinc-700">
                            Vote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 text-white">
                          <DialogHeader>
                            <DialogTitle>Vote on Proposal</DialogTitle>
                            <DialogDescription>
                              Cast your vote for &quot;{proposal.title}&quot;
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-center space-x-4 py-4">
                            <Button className="bg-green-600 hover:bg-green-700">
                              Vote For
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700">
                              Vote Against
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

