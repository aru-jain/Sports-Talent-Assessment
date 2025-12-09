'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowRight, Plus, X, AlertTriangle, Heart, Activity, Pill, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { storage, type MedicalRecord } from '@/lib/utils'

const medicalRecordSchema = z.object({
  type: z.enum(['injury', 'surgery', 'condition', 'medication']),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  date: z.string(),
  status: z.enum(['active', 'resolved'])
})

type MedicalFormData = z.infer<typeof medicalRecordSchema>

export default function MedicalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MedicalFormData>({
    resolver: zodResolver(medicalRecordSchema)
  })

  const onSubmit = (data: MedicalFormData) => {
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      ...data
    }
    
    setMedicalRecords(prev => [...prev, newRecord])
    reset()
    setShowAddForm(false)
  }

  const removeRecord = (id: string) => {
    setMedicalRecords(prev => prev.filter(record => record.id !== id))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    // Save medical records
    const user = storage.get('currentUser')
    if (user) {
      storage.set('currentUser', { 
        ...user, 
        medicalRecords,
        onboardingComplete: true 
      })
      
      setTimeout(() => {
        setIsLoading(false)
        // Navigate to dashboard
      }, 1000)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'injury': return AlertTriangle
      case 'surgery': return Heart
      case 'condition': return Activity
      case 'medication': return Pill
      default: return FileText
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'injury': return 'bg-red-50 border-red-200 text-red-700'
      case 'surgery': return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'condition': return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'medication': return 'bg-blue-50 border-blue-200 text-blue-700'
      default: return 'bg-surface border-border text-foreground'
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
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted">Add your medical history for personalized training recommendations</p>
          </div>
        </div>

        {/* Current Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Medical History</h3>
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {medicalRecords.length === 0 && !showAddForm && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-muted" />
              </div>
              <div>
                <p className="text-foreground font-medium">No medical records yet</p>
                <p className="text-sm text-muted">Add any relevant medical information</p>
              </div>
              <motion.button
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Add Medical Record
              </motion.button>
            </div>
          )}

          {medicalRecords.map((record, index) => {
            const Icon = getRecordIcon(record.type)
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl border ${getRecordColor(record.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold capitalize">{record.type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === 'active' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <p className="text-sm">{record.description}</p>
                      <p className="text-xs opacity-75 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => removeRecord(record.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-2xl p-6 space-y-4"
          >
            <h4 className="font-semibold text-foreground">Add Medical Record</h4>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select type</option>
                <option value="injury">Injury</option>
                <option value="surgery">Surgery</option>
                <option value="condition">Medical Condition</option>
                <option value="medication">Medication</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Describe the medical record..."
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-surface hover:bg-surface-dark text-foreground font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Add Record
              </button>
            </div>
          </motion.form>
        )}

        {/* Info Card */}
        <div className="bg-primary-50 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <Heart className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-primary-dark text-sm">Privacy & Security</h4>
              <p className="text-xs text-primary-dark/80 leading-relaxed">
                Your medical information is encrypted and only used to provide safe, 
                personalized training recommendations. You can update this anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href="/onboarding/measurements" className="flex-1">
            <button
              type="button"
              className="w-full bg-surface hover:bg-surface-dark text-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-200"
            >
              Back
            </button>
          </Link>
          
          <Link href="/dashboard" className="flex-2">
            <motion.button
              onClick={handleComplete}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Complete Onboarding
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
