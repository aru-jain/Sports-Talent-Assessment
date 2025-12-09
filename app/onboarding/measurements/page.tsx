'use client'

import { motion } from 'framer-motion'
import { User, ArrowRight, Calculator, Activity, Heart, Scale } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { storage, calculateBMI, getBMICategory, type BodyMeasurements } from '@/lib/utils'

const measurementsSchema = z.object({
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm'),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(200, 'Weight must be less than 200kg'),
  age: z.number().min(13, 'Age must be at least 13').max(80, 'Age must be less than 80'),
  gender: z.enum(['male', 'female', 'other']),
  bodyFat: z.number().min(5).max(50).optional(),
  muscleMass: z.number().min(20).max(100).optional(),
  restingHeartRate: z.number().min(40).max(120).optional(),
})

type MeasurementsFormData = z.infer<typeof measurementsSchema>

export default function MeasurementsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<MeasurementsFormData>({
    resolver: zodResolver(measurementsSchema)
  })

  const watchedHeight = watch('height')
  const watchedWeight = watch('weight')

  useEffect(() => {
    if (watchedHeight && watchedWeight) {
      const calculatedBMI = calculateBMI(watchedWeight, watchedHeight)
      setBmi(calculatedBMI)
      setBmiCategory(getBMICategory(calculatedBMI))
    }
  }, [watchedHeight, watchedWeight])

  const onSubmit = async (data: MeasurementsFormData) => {
    setIsLoading(true)
    
    const measurements: BodyMeasurements = {
      ...data,
      bmi: calculateBMI(data.weight, data.height)
    }
    
    // Update user data
    const user = storage.get('currentUser')
    if (user) {
      storage.set('currentUser', { ...user, bodyMeasurements: measurements })
      
      setTimeout(() => {
        setIsLoading(false)
        // Navigate to medical records
      }, 1000)
    }
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Normal': return 'text-primary bg-primary-50 border-primary/20'
      case 'Overweight': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'Obese': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-muted bg-surface border-border'
    }
  }

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
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Body Measurements</h1>
            <p className="text-muted">Enter your physical measurements for personalized analysis</p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Measurements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Basic Measurements
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  {...register('height', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="170"
                />
                {errors.height && (
                  <p className="text-sm text-red-500 mt-1">{errors.height.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weight (kg)
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="70"
                />
                {errors.weight && (
                  <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age
                </label>
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="25"
                />
                {errors.age && (
                  <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* BMI Calculator */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`p-4 rounded-2xl border ${getBMIColor(bmiCategory)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  <span className="font-semibold">BMI Calculator</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{bmi}</div>
                  <div className="text-sm font-medium">{bmiCategory}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advanced Measurements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Advanced Measurements
              <span className="text-sm font-normal text-muted">(Optional)</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Body Fat Percentage (%)
              </label>
              <input
                {...register('bodyFat', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="15.5"
              />
              {errors.bodyFat && (
                <p className="text-sm text-red-500 mt-1">{errors.bodyFat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Muscle Mass (kg)
              </label>
              <input
                {...register('muscleMass', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="45.2"
              />
              {errors.muscleMass && (
                <p className="text-sm text-red-500 mt-1">{errors.muscleMass.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Resting Heart Rate (BPM)
              </label>
              <input
                {...register('restingHeartRate', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="72"
              />
              {errors.restingHeartRate && (
                <p className="text-sm text-red-500 mt-1">{errors.restingHeartRate.message}</p>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-primary-50 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-primary-dark text-sm">Why we need this information</h4>
                <p className="text-xs text-primary-dark/80 leading-relaxed">
                  Your body measurements help our AI provide personalized performance analysis 
                  and accurate form assessments tailored to your physique.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link href="/onboarding/kyc" className="flex-1">
              <button
                type="button"
                className="w-full bg-surface hover:bg-surface-dark text-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-200"
              >
                Back
              </button>
            </Link>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Navigation to Medical Records */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link href="/onboarding/medical">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200"
              >
                Continue to Medical Records
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
