import React from 'react'

interface GoldNFTPreviewProps {
  title: string
  weight: string
  purity: string
  serialNumber: string
}

export function GoldNFTPreview({ title, weight, purity, serialNumber }: GoldNFTPreviewProps) {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#FFD700" />
      <text x="150" y="50" fontFamily="Arial" fontSize="24" fill="black" textAnchor="middle">{title}</text>
      <text x="150" y="100" fontFamily="Arial" fontSize="18" fill="black" textAnchor="middle">Weight: {weight}g</text>
      <text x="150" y="130" fontFamily="Arial" fontSize="18" fill="black" textAnchor="middle">Purity: {purity}%</text>
      <text x="150" y="160" fontFamily="Arial" fontSize="18" fill="black" textAnchor="middle">S/N: {serialNumber}</text>
      <polygon points="50,200 250,200 150,280" fill="#DAA520" />
      <text x="150" y="250" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">STARKMINE GOLD</text>
    </svg>
  )
}

