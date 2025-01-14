import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-900 py-12 text-zinc-400">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">About Starkmine</h3>
            <p className="text-sm">Empowering gold trading on the blockchain, providing secure and transparent access to fractional gold ownership.</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pools" className="hover:text-white transition-colors">Gold Pools</Link></li>
              <li><Link href="/staking" className="hover:text-white transition-colors">Staking</Link></li>
              <li><Link href="/governance" className="hover:text-white transition-colors">Governance</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://github.com/starkmine" className="hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com/starkmine" className="hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="https://linkedin.com/company/starkmine" className="hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Starkmine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

