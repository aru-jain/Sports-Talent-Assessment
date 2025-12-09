'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Activity, Trophy, Users, Zap, Target } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Background - Following your CSS guide */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-dark/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent" 
               style={{ 
                 background: 'radial-gradient(600px 380px at 28% 42%, rgba(202,245,84,0.06) 0%, rgba(202,245,84,0.03) 18%, transparent 45%)'
               }} />
        </div>
        
        <div className="relative px-6 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center space-x-3"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">CoreX</h1>
                <p className="text-sm text-muted -mt-1">AI Performance Analysis</p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                AI-Powered Athlete
                <span className="text-primary block">Performance Analysis</span>
              </h2>
              <p className="text-lg text-muted max-w-md mx-auto leading-relaxed">
                Transform your training with AI-powered analysis. Get instant feedback, track progress, and reach your peak performance.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all duration-200"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/sai-dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-card border border-border text-foreground font-semibold py-4 px-8 rounded-2xl hover:bg-surface transition-all duration-200"
                >
                  SAI Dashboard
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12 bg-surface/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-foreground">Powerful Features</h3>
            <p className="text-muted">Everything you need for comprehensive athlete analysis</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-2xl border border-border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12 bg-surface-dark/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <h3 className="text-2xl font-bold text-foreground">Trusted by Athletes Across India</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-primary to-primary-dark">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6 text-white"
        >
          <h3 className="text-3xl font-bold">Ready to Elevate Your Performance?</h3>
          <p className="text-primary-100 max-w-md mx-auto">
            Join thousands of athletes already using CoreX to reach their peak performance
          </p>
          <Link href="/onboarding">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-black font-bold py-4 px-8 rounded-2xl hover:bg-primary-dark transition-all duration-200 shadow-lg"
            >
              Start Your Journey
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: Shield,
    title: 'Secure KYC Verification',
    description: 'Aadhaar-based verification through DigiLocker for secure athlete onboarding',
    color: 'bg-blue-500'
  },
  {
    icon: Activity,
    title: 'AI Video Analysis',
    description: 'Advanced computer vision analyzes your form, technique, and performance metrics',
    color: 'bg-primary'
  },
  {
    icon: Trophy,
    title: 'Performance Tracking',
    description: 'Track your progress across multiple sports and assessment types',
    color: 'bg-amber-500'
  },
  {
    icon: Users,
    title: 'Talent Discovery',
    description: 'Help SAI identify and nurture talent from across India',
    color: 'bg-purple-500'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get real-time feedback and improvement suggestions',
    color: 'bg-orange-500'
  },
  {
    icon: Target,
    title: 'Precision Analysis',
    description: 'Detailed biomechanical analysis for optimal performance',
    color: 'bg-red-500'
  }
]

const stats = [
  { value: '10K+', label: 'Athletes' },
  { value: '50K+', label: 'Assessments' },
  { value: '95%', label: 'Accuracy' },
  { value: '28', label: 'States' }
]
