'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2023-01-01', price: 1800 },
  { date: '2023-02-01', price: 1850 },
  { date: '2023-03-01', price: 1900 },
  { date: '2023-04-01', price: 1950 },
  { date: '2023-05-01', price: 2000 },
  { date: '2023-06-01', price: 2050 },
  { date: '2023-07-01', price: 2100 },
]

export function PriceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#333', border: 'none' }}
          labelStyle={{ color: '#fff' }}
        />
        <Line type="monotone" dataKey="price" stroke="#ff9800" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

