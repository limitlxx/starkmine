'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button" 
import { X } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface SidebarProps {
  className?: string;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: string) => void;
  onClose?: () => void;
}

interface FilterState {
  pool: ("invault" | "open")[];
  verified: boolean;
  size: ("small" | "large")[];
}

export function Sidebar({ className = "", onFilterChange, onSortChange, onClose }: SidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    pool: [],
    verified: false,
    size: [],
  })
 

  const router = useRouter()

  const handleFilterChange = (key: keyof FilterState, value: any|string) => {
    let newFilters: FilterState;
    if (key === 'pool' || key === 'size') {
      newFilters = {
        ...filters,
        [key]: (filters[key] as string[]).includes(value)
          ? (filters[key] as string[]).filter(item => item !== value)
          : [...(filters[key] as string[]), value]
      };
    } else {
      newFilters = { ...filters, [key]: value };
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  return (
    <aside className={`bg-zinc-900 p-4 ${className}`}>
        <div className="lg:hidden mb-4 flex justify-end">

            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">

            <X className="h-6 w-6" />

            </Button>

        </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm text-zinc-500">Sort by:</Label>
          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-full justify-between border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800">
              <SelectValue placeholder="Popular" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
              <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-zinc-500">Pool</Label>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filters.pool.includes('invault') ? "secondary" : "outline"}
              className="h-8 rounded-full bg-zinc-800 text-sm text-white hover:bg-zinc-700"
              onClick={() => handleFilterChange('pool', 'invault')}
            >
              Invault
            </Button>
            <Button 
              variant={filters.pool.includes('open') ? "secondary" : "outline"}
              className="h-8 rounded-full border-zinc-700 bg-transparent text-sm text-white hover:bg-zinc-800"
              onClick={() => handleFilterChange('pool', 'open')}
            >
              Open
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified" 
              checked={filters.verified}
              onCheckedChange={(checked) => handleFilterChange('verified', checked)}
            />
            <label
              htmlFor="verified"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
            >
              Verified
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-zinc-500">Size</Label>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filters.size.includes('small') ? "secondary" : "outline"}
              className="h-8 rounded-full border-zinc-700 bg-transparent text-sm text-white hover:bg-zinc-800"
              onClick={() => handleFilterChange('size', 'small')}
            >
              {'< 100g'}
            </Button>
            <Button 
              variant={filters.size.includes('large') ? "secondary" : "outline"}
              className="h-8 rounded-full border-zinc-700 bg-transparent text-sm text-white hover:bg-zinc-800"
              onClick={() => handleFilterChange('size', 'large')}
            >
              {'> 100g'}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden rounded-xl bg-gradient-to-br from-orange-200 to-orange-100 p-4">
          <h3 className="text-xl font-semibold text-zinc-900">
            Become a starkminer
          </h3>
          
          <Button onClick={() => router.push('/register')}
            className="mt-4 w-full rounded-lg bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Verify your KYC
          </Button>
        </Card>
      </div>
    </aside>
  )
}

