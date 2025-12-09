'use client'

import { motion } from 'framer-motion'
import { BarChart3, Users, Trophy, Settings, Bell, Search, Menu, Target, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const sidebarItems = [
  { href: '/sai-dashboard', icon: BarChart3, label: 'Analytics' },
  { href: '/sai-dashboard/athletes', icon: Users, label: 'Athletes' },
  { href: '/sai-dashboard/assessments', icon: Trophy, label: 'Assessments' },
  { href: '/sai-dashboard/talent', icon: Target, label: 'Talent Pool' },
  { href: '/sai-dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function SAIDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-card border-r border-border flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } lg:w-64`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} lg:opacity-100`}>
              <h1 className="font-bold text-foreground">SAI Dashboard</h1>
              <p className="text-sm text-muted -mt-1">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : 'text-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className={`font-medium transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0'
                  } lg:opacity-100`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="saiActiveTab"
                      className="absolute inset-0 bg-primary rounded-2xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-primary-50 border border-primary/20 rounded-2xl p-4">
            <div className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} lg:opacity-100`}>
              <h4 className="font-semibold text-primary-dark text-sm">Need Help?</h4>
              <p className="text-xs text-primary-dark/80 mt-1">
                Contact technical support for assistance
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </motion.button>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search athletes, assessments..."
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Filter className="w-5 h-5 text-foreground" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Download className="w-5 h-5 text-foreground" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors relative"
              >
                <Bell className="w-5 h-5 text-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              </motion.button>
              
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
