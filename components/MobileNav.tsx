'use client'

import { motion } from 'framer-motion'
import { Home, Activity, Trophy, User, Play, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/assessments', icon: Activity, label: 'Assessments' },
  { href: '/dashboard/feedback', icon: MessageSquare, label: 'Feedback' },
  { href: '/dashboard/progress', icon: Trophy, label: 'Progress' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
