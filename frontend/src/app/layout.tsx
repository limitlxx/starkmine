import type { Metadata } from "next"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider" 

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

