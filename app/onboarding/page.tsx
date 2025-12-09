'use client'

import { motion } from 'framer-motion'
import { Shield, User, Activity, FileText, ArrowRight, CheckCircle, Phone, Mail, Calculator, Heart, Scale, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { storage, calculateBMI, getBMICategory, type BodyMeasurements, type MedicalRecord, type User } from '@/lib/utils'

// Form schemas
const kycSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
})

const measurementsSchema = z.object({
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm'),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(200, 'Weight must be less than 200kg'),
  age: z.number().min(13, 'Age must be at least 13').max(80, 'Age must be less than 80'),
  gender: z.enum(['male', 'female', 'other']),
  bodyFat: z.number().min(5).max(50).optional(),
  muscleMass: z.number().min(20).max(100).optional(),
  restingHeartRate: z.number().min(40).max(120).optional(),
})

const medicalSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  injuries: z.string().optional(),
  chronicConditions: z.string().optional(),
})

type KYCFormData = z.infer<typeof kycSchema>
type MeasurementsFormData = z.infer<typeof measurementsSchema>
type MedicalFormData = z.infer<typeof medicalSchema>

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>('')
  const router = useRouter()

  const steps = [
    {
      icon: Shield,
      title: 'KYC Verification',
      description: 'Verify your identity with Aadhaar through DigiLocker',
      color: 'bg-blue-500'
    },
    {
      icon: User,
      title: 'Body Measurements',
      description: 'Enter your physical measurements and fitness stats',
      color: 'bg-primary'
    },
    {
      icon: Activity,
      title: 'Medical Records',
      description: 'Add your medical history and current health status',
      color: 'bg-amber-500'
    },
    {
      icon: CheckCircle,
      title: 'Complete Setup',
      description: 'Review and complete your athlete profile',
      color: 'bg-purple-500'
    }
  ]

  // Form instances
  const kycForm = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema)
  })

  const measurementsForm = useForm<MeasurementsFormData>({
    resolver: zodResolver(measurementsSchema)
  })

  const medicalForm = useForm<MedicalFormData>({
    resolver: zodResolver(medicalSchema)
  })

  const watchedHeight = measurementsForm.watch('height')
  const watchedWeight = measurementsForm.watch('weight')

  useEffect(() => {
    if (watchedHeight && watchedWeight) {
      const calculatedBMI = calculateBMI(watchedWeight, watchedHeight)
      setBmi(calculatedBMI)
      setBmiCategory(getBMICategory(calculatedBMI))
    }
  }, [watchedHeight, watchedWeight])

  // Form submission handlers
  const handleKYCSubmit = async (data: KYCFormData) => {
    setIsLoading(true)
    
    // Save basic user data
    const userData = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      aadhaarVerified: true, // Mock verification
      onboardingComplete: false,
      createdAt: new Date().toISOString()
    }
    
    storage.set('currentUser', userData)
    setCurrentStep(1)
    setIsLoading(false)
  }

  const handleMeasurementsSubmit = async (data: MeasurementsFormData) => {
    setIsLoading(true)
    
    const measurements: BodyMeasurements = {
      ...data,
      bmi: calculateBMI(data.weight, data.height)
    }
    
    const currentUser = storage.get('currentUser')
    if (currentUser) {
      storage.set('currentUser', { ...currentUser, bodyMeasurements: measurements })
    }
    
    setCurrentStep(2)
    setIsLoading(false)
  }

  const handleMedicalSubmit = async (data: MedicalFormData) => {
    setIsLoading(true)
    
    const medicalRecord: MedicalRecord = {
      id: Date.now().toString(),
      ...data,
      recordDate: new Date().toISOString()
    }
    
    const currentUser = storage.get('currentUser')
    if (currentUser) {
      storage.set('currentUser', { 
        ...currentUser, 
        medicalRecords: [medicalRecord],
        onboardingComplete: true
      })
    }
    
    setCurrentStep(3)
    setIsLoading(false)
  }

  const completeOnboarding = () => {
    router.push('/dashboard')
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex-1 px-6 py-6 max-w-md mx-auto">
      {/* Header with Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 mb-8"
      >
        <div className="flex items-center justify-between">
          {currentStep > 0 && (
            <motion.button
              onClick={goBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-foreground">{steps[currentStep].title}</h1>
            <p className="text-muted text-sm mt-1">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-primary border-primary text-black'
                  : index === currentStep
                  ? 'border-primary text-primary'
                  : 'border-border text-muted'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* KYC Step */}
        {currentStep === 0 && (
          <form onSubmit={kycForm.handleSubmit(handleKYCSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  {...kycForm.register('name')}
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter your full name"
                />
                {kycForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{kycForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  {...kycForm.register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter your email"
                />
                {kycForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{kycForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  {...kycForm.register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter your mobile number"
                />
                {kycForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{kycForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Aadhaar Number</label>
                <input
                  {...kycForm.register('aadhaar')}
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter your 12-digit Aadhaar number"
                />
                {kycForm.formState.errors.aadhaar && (
                  <p className="text-red-500 text-sm mt-1">{kycForm.formState.errors.aadhaar.message}</p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify with DigiLocker'}
            </motion.button>
          </form>
        )}

        {/* Measurements Step */}
        {currentStep === 1 && (
          <form onSubmit={measurementsForm.handleSubmit(handleMeasurementsSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                <input
                  {...measurementsForm.register('height', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="170"
                />
                {measurementsForm.formState.errors.height && (
                  <p className="text-red-500 text-sm mt-1">{measurementsForm.formState.errors.height.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                <input
                  {...measurementsForm.register('weight', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="70"
                />
                {measurementsForm.formState.errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{measurementsForm.formState.errors.weight.message}</p>
                )}
              </div>
            </div>

            {bmi && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{bmi.toFixed(1)}</div>
                  <div className="text-sm text-primary-dark">BMI - {bmiCategory}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                <input
                  {...measurementsForm.register('age', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                <select
                  {...measurementsForm.register('gender')}
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Measurements'}
            </motion.button>
          </form>
        )}

        {/* Medical Step */}
        {currentStep === 2 && (
          <form onSubmit={medicalForm.handleSubmit(handleMedicalSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Blood Group</label>
              <select
                {...medicalForm.register('bloodGroup')}
                className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Allergies (Optional)</label>
              <textarea
                {...medicalForm.register('allergies')}
                className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                placeholder="List any known allergies..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Medications (Optional)</label>
              <textarea
                {...medicalForm.register('medications')}
                className="w-full px-4 py-3 bg-surface border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                placeholder="List current medications..."
                rows={3}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Medical Records'}
            </motion.button>
          </form>
        )}

        {/* Complete Step */}
        {currentStep === 3 && (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-black" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Profile Complete!</h2>
              <p className="text-muted">
                Your athlete profile has been set up successfully. You're ready to start your AI-powered performance journey with CoreX.
              </p>
            </div>

            <motion.button
              onClick={completeOnboarding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
