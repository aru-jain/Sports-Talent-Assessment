'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Target, Play, Trophy, Activity, Camera } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'
import { usePermissions } from '@/contexts/PermissionsContext'
import { MobileService } from '@/lib/mobile'

const onboardingSteps = [
  {
    id: 1,
    title: 'CoreX',
    subtitle: 'AI Sports Analysis',
    description: 'Transform your athletic performance with AI technology designed for Indian athletes.',
    icon: Target,
    color: 'from-primary/20 via-primary/10 to-transparent'
  },
  {
    id: 2,
    title: 'Record',
    subtitle: 'Upload Training Video',
    description: 'Upload your training session. Our AI analyzes form, technique, and performance.',
    icon: Play,
    color: 'from-info/20 via-info/10 to-transparent'
  },
  {
    id: 3,
    title: 'Analyze',
    subtitle: 'Get AI Feedback',
    description: 'Receive detailed performance analysis and personalized improvement suggestions.',
    icon: Activity,
    color: 'from-success/20 via-success/10 to-transparent'
  },
  {
    id: 4,
    title: 'Excel',
    subtitle: 'Join SAI Network',
    description: 'Get discovered by SAI officials and unlock new opportunities in Indian sports.',
    icon: Trophy,
    color: 'from-warning/20 via-warning/10 to-transparent'
  }
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const router = useRouter()
  const { permissions, requestPermissions, isLoading: permissionsLoading } = usePermissions()

  useEffect(() => {
    setMounted(true)
    checkExistingUser()
  }, [])

  const checkExistingUser = async () => {
    try {
      // Check if user data exists
      const existingUser = storage.get('currentUser')
      if (existingUser) {
        // User exists, redirect to dashboard
        router.replace('/dashboard')
        return
      }
      
      // No user found, request camera permissions for the app
      if (!permissionsLoading) {
        await requestPermissions()
        // Camera permissions handled silently
      }
    } catch (error) {
      console.error('Error checking user or permissions:', error)
    } finally {
      setIsCheckingUser(false)
      // Hide splash screen when app is ready
      MobileService.hideSplashScreen()
    }
  }

  if (!mounted || isCheckingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted">Setting up CoreX...</p>
        </div>
      </div>
    )
  }

  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1
  const isFirstStep = currentStep === 0

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface/20 via-background to-surface/10" />
      
      <div className="relative flex flex-col h-screen max-w-sm mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Target className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-foreground text-lg">CoreX</span>
          </div>
          
          {/* <Link href="/landing">
            <span className="text-xs text-muted hover:text-muted-light transition-colors">Skip</span>
          </Link> */}
        </div>

        {/* Progress - Minimal */}
        <div className="px-6 mb-12">
          <div className="w-full h-0.5 bg-surface rounded-full">
            <motion.div
              className="h-0.5 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Content - Clean & Minimal */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center space-y-8"
            >
              {/* Large Icon - Minimalist */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-16 h-16 text-primary" />
                </div>
              </motion.div>

              {/* Text Content - Clean Typography */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold text-foreground">
                  {step.title}
                </h1>
                <p className="text-lg text-primary font-medium">
                  {step.subtitle}
                </p>
                <p className="text-muted leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation - Minimal */}
        <div className="p-6 space-y-6">
          <div className="flex items-center">
            {isLastStep ? (
              <Link href="/onboarding" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                >
                  Get Started
                </motion.button>
              </Link>
            ) : (
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200"
              >
                Next
              </motion.button>
            )}
          </div>

        </div>

        {/* Step Indicators - Minimal dots */}
        <div className="flex justify-center space-x-1 pb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary w-4' : 'bg-surface'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
