'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Target } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isFirstStep = pathname === '/onboarding'

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            {!isFirstStep && (
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-surface hover:bg-surface-dark transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </motion.button>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">CoreX</span>
            </div>
          </div>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-muted hover:text-foreground transition-colors text-sm font-medium"
            >
              Exit
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
