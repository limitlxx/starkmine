'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from 'lucide-react'
import Image from "next/image"

interface BuySellModalProps {
  isOpen: boolean
  onClose: () => void
  nft: {
    id: string
    name: string
    image: string
    weight: string
    purity: string
    pricePerFraction: number
    totalSupply: number
    availableFractions: number
  }
}

export function BuySellModal({ isOpen, onClose, nft }: BuySellModalProps) {
  const [quantity, setQuantity] = useState(1)
  // const [step, setStep] = useState<'select' | 'summary'>('select')

  const total = quantity * nft.pricePerFraction

  const handleSubmit = (action: 'buy' | 'sell') => {
    // Implement buy/sell logic here
    console.log(`${action} ${quantity} fractions of ${nft.name}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-zinc-900 text-white">
        <DialogHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>{nft.name}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>0xc662...DxF8c45</span>
              <Copy className="h-4 w-4 cursor-pointer" />
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="buy">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              <BuySellForm
                nft={nft}
                action="buy"
                quantity={quantity}
                setQuantity={setQuantity}
                total={total}
                onSubmit={() => handleSubmit('buy')}
              />
            </TabsContent>
            <TabsContent value="sell">
              <BuySellForm
                nft={nft}
                action="sell"
                quantity={quantity}
                setQuantity={setQuantity}
                total={total}
                onSubmit={() => handleSubmit('sell')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface BuySellFormProps {
  nft: BuySellModalProps['nft']
  action: 'buy' | 'sell'
  quantity: number
  setQuantity: (quantity: number) => void
  total: number
  onSubmit: () => void
}

function BuySellForm({ nft, action, quantity, setQuantity, total, onSubmit }: BuySellFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-lg bg-zinc-800">
          <Image
            src={nft.image}
            alt={nft.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{nft.name}</h4>
          <div className="mt-1 text-sm text-zinc-400">
            Weight: {nft.weight} • Purity: {nft.purity}
          </div>
          <div className="mt-2 text-sm text-zinc-400">
            {nft.availableFractions} of {nft.totalSupply} fractions available
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">
          Quantity ({action === 'buy' ? 'max ' + nft.availableFractions : 'max ' + (nft.totalSupply - nft.availableFractions)})
        </label>
        <Input
          type="number"
          min={1}
          max={action === 'buy' ? nft.availableFractions : (nft.totalSupply - nft.availableFractions)}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">Price per Fraction</span>
        <span>{nft.pricePerFraction} STRK</span>
      </div>

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{total.toFixed(2)} STRK</span>
      </div>

      <Button 
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
        onClick={onSubmit}
      >
        {action === 'buy' ? 'Buy Now' : 'Sell Now'}
      </Button>
    </div>
  )
}

