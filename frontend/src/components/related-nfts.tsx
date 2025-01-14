import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const relatedNFTs = [
  { id: '1', name: '100g Gold Bar', image: '/placeholder.svg', price: 400 },
  { id: '2', name: '500g Gold Bar', image: '/placeholder.svg', price: 2000 },
  { id: '3', name: '1kg Gold Bar', image: '/placeholder.svg', price: 4000 },
]

export function RelatedNFTs() {
  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Related NFTs</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedNFTs.map((nft) => (
          <Card key={nft.id} className="bg-zinc-900 p-4">
            <div className="aspect-square mb-4">
              <Image
                src={nft.image}
                alt={nft.name}
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">{nft.price} STRK</span>
              <Link href={`/nft/${nft.id}`}>
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  View
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

