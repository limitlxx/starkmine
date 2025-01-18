import React from 'react'
import { Diamond, CreditCard, ChevronRight } from 'lucide-react'

interface GoldNFTPreviewProps {
  title: string
  weight: string
  purity: string
  serialNumber: string
  issueDate: string
}

export function GoldNFTPreview({
  title,
  weight,
  purity,
  serialNumber,
  issueDate
}: GoldNFTPreviewProps) {
  return (
    <div className="relative w-[430px] h-[270px]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 430 270"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-2xl"
      >
        {/* Gradients and Filters */}
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>

          <filter id="blur">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Background with border */}
        <rect
          width="100%"
          height="100%"
          rx="16"
          ry="16"
          fill="url(#cardGradient)"
          stroke="rgba(218, 165, 32, 0.4)"
          strokeWidth="1"
        />

        {/* Shimmer effect */}
        <rect
          width="100%"
          height="100%"
          rx="16"
          ry="16"
          fill="url(#shimmer)"
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

        {/* Security Chip */}
        <rect
          x="32"
          y="32"
          width="48"
          height="40"
          rx="6"
          ry="6"
          fill="url(#cardGradient)"
          stroke="rgba(255, 215, 0, 0.3)"
          strokeWidth="1"
        />

        {/* Weight and Purity */}
        <text
          x="32"
          y="160"
          fontFamily="monospace"
          fontSize="24"
          fill="rgba(255,255,255,0.9)"
          letterSpacing="0.2em"
        >{`${weight} • ${purity}%`}</text>

        {/* Serial Number */}
        <text
          x="32"
          y="210"
          fontFamily="Arial"
          fontSize="12"
          fill="rgba(255,255,255,0.5)"
          letterSpacing="0.1em"
        >SERIAL NUMBER</text>
        <text
          x="32"
          y="230"
          fontFamily="Arial"
          fontSize="14"
          fill="rgba(255,255,255,0.9)"
          letterSpacing="0.1em"
        >{serialNumber}</text>

        {/* Issue Date */}
        <text
          x="398"
          y="210"
          fontFamily="Arial"
          fontSize="12"
          fill="rgba(255,255,255,0.5)"
          textAnchor="end"
          letterSpacing="0.1em"
        >ISSUE DATE</text>
        <text
          x="398"
          y="230"
          fontFamily="Arial"
          fontSize="14"
          fill="rgba(255,255,255,0.9)"
          textAnchor="end"
          letterSpacing="0.1em"
        >{issueDate}</text>
      </svg>

      {/* Overlay Elements */}
      <div className="absolute top-8 right-8">
        <Diamond className="w-8 h-8 text-white/70" />
      </div>

      <div className="absolute top-8 left-28 flex items-center space-x-2">
        <CreditCard className="w-6 h-6 text-white/90" />
        <span className="text-white/90 font-semibold tracking-wider">STARKMINE</span>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center space-x-1 text-white/90">
        <span className="text-sm font-semibold">{title}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  )
}