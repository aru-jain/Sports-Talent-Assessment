'use client'

import { motion } from 'framer-motion'
import { User, Edit, Shield, Activity, Heart, Calendar, Mail, Phone, MapPin, Trophy, Medal, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage, type User as UserType, type AssessmentSession, getBMICategory, calculateUserStats } from '@/lib/utils'

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [sessions, setSessions] = useState<AssessmentSession[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = storage.get<UserType>('currentUser')
    const userSessions = storage.get<AssessmentSession[]>('userSessions') || []
    setUser(userData)
    setSessions(userSessions)
  }, [])

  const handleSignOut = () => {
    // Clear all localStorage data
    storage.remove('currentUser')
    storage.remove('userSessions')
    
    // Redirect to home page
    router.push('/')
  }

  if (!user) {
    return (
      <div className="flex-1 px-6 py-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-muted" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Profile Data</h3>
            <p className="text-muted">Complete onboarding to see your profile</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate real stats from session data using utility function
  const calculatedStats = calculateUserStats(sessions)
  
  const stats = [
    { label: 'Sessions', value: calculatedStats.totalSessions.toString(), icon: Activity, color: 'bg-primary' },
    { label: 'Best Score', value: calculatedStats.bestScore > 0 ? `${calculatedStats.bestScore}%` : 'N/A', icon: Trophy, color: 'bg-amber-500' },
    { label: 'Rank', value: calculatedStats.bestScore > 0 ? `#${calculatedStats.rank}` : 'N/A', icon: Medal, color: 'bg-purple-500' },
    { label: 'Streak', value: calculatedStats.streak > 0 ? `${calculatedStats.streak} days` : '0 days', icon: Target, color: 'bg-blue-500' }
  ]

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted">Manage your athlete information</p>
        </div>
        
        <motion.button
          onClick={() => setIsEditing(!isEditing)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Edit className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-surface border border-border-light rounded-3xl p-6 relative overflow-hidden"
      >
        {/* Subtle neon accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="relative flex items-center space-x-4">
          <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1 text-foreground">{user.name}</h2>
            <p className="text-muted mb-2 break-all text-sm">{user.email}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                {user.aadhaarVerified ? 'Verified' : 'Unverified'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            className="bg-surface border border-border-light rounded-2xl p-4"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-surface border border-border-light rounded-2xl p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-muted mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground break-all">{user.email}</div>
              <div className="text-sm text-muted">Email Address</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-muted" />
            <div>
              <div className="font-medium text-foreground">{user.phone}</div>
              <div className="text-sm text-muted">Mobile Number</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted" />
            <div>
              <div className="font-medium text-foreground">
                {user.aadhaarVerified ? 'Verified Account' : 'Verification Pending'}
              </div>
              <div className="text-sm text-muted">KYC Status</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Body Measurements */}
      {user.bodyMeasurements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-surface border border-border-light rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">Body Measurements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{user.bodyMeasurements.height} cm</div>
              <div className="text-sm text-muted">Height</div>
            </div>
            
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{user.bodyMeasurements.weight} kg</div>
              <div className="text-sm text-muted">Weight</div>
            </div>
            
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{user.bodyMeasurements.age}</div>
              <div className="text-sm text-muted">Age</div>
            </div>
            
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground capitalize">{user.bodyMeasurements.gender}</div>
              <div className="text-sm text-muted">Gender</div>
            </div>
          </div>
          
          <div className="bg-primary-50 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary-dark">BMI: {user.bodyMeasurements.bmi}</div>
                <div className="text-sm text-primary-dark/80">{getBMICategory(user.bodyMeasurements.bmi)}</div>
              </div>
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {(user.bodyMeasurements.bodyFat || user.bodyMeasurements.muscleMass || user.bodyMeasurements.restingHeartRate) && (
            <div className="grid grid-cols-3 gap-4">
              {user.bodyMeasurements.bodyFat && (
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-foreground">{user.bodyMeasurements.bodyFat}%</div>
                  <div className="text-xs text-muted">Body Fat</div>
                </div>
              )}
              
              {user.bodyMeasurements.muscleMass && (
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-foreground">{user.bodyMeasurements.muscleMass} kg</div>
                  <div className="text-xs text-muted">Muscle Mass</div>
                </div>
              )}
              
              {user.bodyMeasurements.restingHeartRate && (
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-foreground">{user.bodyMeasurements.restingHeartRate}</div>
                  <div className="text-xs text-muted">Resting HR</div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Medical Records */}
      {user.medicalRecords && user.medicalRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-surface border border-border-light rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">Medical Records</h3>
          
          <div className="space-y-3">
            {user.medicalRecords.slice(0, 3).map((record, index) => (
              <div key={record.id} className="bg-surface rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground capitalize">{record.type}</h4>
                    <p className="text-sm text-muted">{record.description}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'active' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {record.status}
                  </div>
                </div>
              </div>
            ))}
            
            {user.medicalRecords.length > 3 && (
              <div className="text-center">
                <span className="text-sm text-muted">
                  +{user.medicalRecords.length - 3} more records
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-surface hover:bg-surface-dark text-foreground font-medium py-3 px-6 rounded-2xl transition-colors"
        >
          Update Profile Information
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-surface hover:bg-surface-dark text-foreground font-medium py-3 px-6 rounded-2xl transition-colors"
        >
          Privacy & Security Settings
        </motion.button>
        
        <motion.button
          onClick={handleSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-6 rounded-2xl transition-colors"
        >
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  )
}
