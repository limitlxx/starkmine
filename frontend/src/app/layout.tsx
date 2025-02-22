import type { Metadata } from "next"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider" 
import { StarknetProvider } from "@/components/starknet-provider";

export const metadata: Metadata = {
  title: "Starkmine",
  description: "Revolutionizing Gold Trading on the Blockchain",
}; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
      <StarknetProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StarknetProvider>
      </body>
    </html>
  )
}

