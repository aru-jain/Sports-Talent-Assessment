'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertCircle, ArrowRight, FileText, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { storage } from '@/lib/utils'

const kycSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
})

type KYCFormData = z.infer<typeof kycSchema>

export default function KYCPage() {
  const [step, setStep] = useState<'form' | 'digilocker' | 'verification' | 'success'>('form')
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema)
  })

  const watchedValues = watch()

  const onSubmit = async (data: KYCFormData) => {
    setIsLoading(true)
    
    // Save basic user data
    const userData = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      aadhaarVerified: false,
      onboardingComplete: false,
      createdAt: new Date().toISOString()
    }
    
    storage.set('currentUser', userData)
    
    // Simulate DigiLocker redirect
    setTimeout(() => {
      setStep('digilocker')
      setIsLoading(false)
    }, 1000)
  }

  const handleDigiLockerAuth = () => {
    setIsLoading(true)
    setStep('verification')
    
    // Simulate verification process
    setTimeout(() => {
      const user = storage.get('currentUser')
      if (user) {
        storage.set('currentUser', { ...user, aadhaarVerified: true })
      }
      setStep('success')
      setIsLoading(false)
    }, 3000)
  }

  const renderProgressBar = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {['form', 'digilocker', 'verification', 'success'].map((s, index) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            step === s ? 'bg-primary text-white' :
            ['form', 'digilocker', 'verification', 'success'].indexOf(step) > index ? 'bg-primary text-white' :
            'bg-surface text-muted'
          }`}>
            {['form', 'digilocker', 'verification', 'success'].indexOf(step) > index ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 3 && (
            <div className={`w-8 h-0.5 mx-2 transition-colors ${
              ['form', 'digilocker', 'verification', 'success'].indexOf(step) > index ? 'bg-primary' : 'bg-border'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex-1 px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>
            <p className="text-muted">Verify your identity securely with DigiLocker</p>
          </div>
        </div>

        {renderProgressBar()}

        {/* Form Step */}
        {step === 'form' && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your mobile number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Aadhaar Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    {...register('aadhaar')}
                    type="text"
                    maxLength={12}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your 12-digit Aadhaar number"
                  />
                </div>
                {errors.aadhaar && (
                  <p className="text-sm text-red-500 mt-1">{errors.aadhaar.message}</p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Continue to DigiLocker
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        {/* DigiLocker Step */}
        {step === 'digilocker' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">DigiLocker Authentication</h3>
                  <p className="text-sm text-blue-700">Secure government verification</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-blue-800">
                <p>• Verify your Aadhaar details securely</p>
                <p>• Access your government documents</p>
                <p>• Complete KYC in minutes</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-medium text-foreground mb-4">Your Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Name:</span>
                  <span className="text-foreground font-medium">{watchedValues.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Mobile:</span>
                  <span className="text-foreground font-medium">{watchedValues.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Aadhaar:</span>
                  <span className="text-foreground font-medium">
                    ****-****-{watchedValues.aadhaar?.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleDigiLockerAuth}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate with DigiLocker
                  <Shield className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Verification Step */}
        {step === 'verification' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Verifying Your Identity</h3>
              <p className="text-muted">Please wait while we verify your documents...</p>
            </div>

            <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6">
              <div className="space-y-2 text-sm text-primary-dark">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Aadhaar details verified
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Identity documents validated
                </p>
                <p className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
                  Final verification in progress...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">KYC Verification Complete!</h3>
              <p className="text-muted">Your identity has been successfully verified</p>
            </div>

            <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6">
              <div className="space-y-2 text-sm text-primary-dark">
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Identity verified successfully
                </p>
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Account security enhanced
                </p>
                <p className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Ready for next step
                </p>
              </div>
            </div>

            <Link href="/onboarding/measurements">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200"
              >
                Continue to Body Measurements
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
