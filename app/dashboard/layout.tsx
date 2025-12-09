'use client'

import { motion } from 'framer-motion'
import MobileNav from '@/components/MobileNav'
import { Bell, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storage, type User } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = storage.get<User>('currentUser')
    setUser(userData)
  }, [])

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">
                {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'CoreX'}
              </h1>
              <p className="text-sm text-muted -mt-0.5">Ready to train?</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-surface hover:bg-surface-dark rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
