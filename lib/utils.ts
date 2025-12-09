import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Local Storage utilities for data persistence
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

// User data types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  aadhaarVerified: boolean
  onboardingComplete: boolean
  bodyMeasurements?: BodyMeasurements
  medicalRecords?: MedicalRecord[]
  createdAt: string
}

export interface BodyMeasurements {
  height: number // cm
  weight: number // kg
  age: number
  gender: 'male' | 'female' | 'other'
  bmi: number
  bodyFat?: number
  muscleMass?: number
  restingHeartRate?: number
}

export interface MedicalRecord {
  id: string
  type: 'injury' | 'surgery' | 'condition' | 'medication'
  description: string
  date: string
  status: 'active' | 'resolved'
}

export interface AssessmentSession {
  id: string
  userId: string
  assessmentType: string
  videoFile?: File
  status: 'recording' | 'processing' | 'completed' | 'failed'
  stats?: AssessmentStats
  createdAt: string
  completedAt?: string
}

export interface AssessmentStats {
  reps?: number
  form_score: number // 0-100
  speed_score: number // 0-100
  endurance_score: number // 0-100
  overall_score: number // 0-100
  feedback: string[]
  improvements: string[]
  cheating_detected: boolean
  video_quality: 'excellent' | 'good' | 'fair' | 'poor'
}

// BMI Calculator
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// Mock data generators
export function generateMockStats(assessmentType: string): AssessmentStats {
  const baseStats = {
    form_score: Math.floor(Math.random() * 30) + 70, // 70-100
    speed_score: Math.floor(Math.random() * 40) + 60, // 60-100
    endurance_score: Math.floor(Math.random() * 35) + 65, // 65-100
    cheating_detected: Math.random() < 0.1, // 10% chance
    video_quality: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as any
  }
  
  baseStats.overall_score = Math.floor((baseStats.form_score + baseStats.speed_score + baseStats.endurance_score) / 3)
  
  const assessmentSpecific = {
    'push-ups': {
      reps: Math.floor(Math.random() * 30) + 20,
      feedback: [
        'Keep your core engaged throughout the movement',
        'Maintain straight line from head to heels',
        'Control the descent for better muscle activation'
      ],
      improvements: [
        'Focus on slower, controlled movements',
        'Strengthen your core with planks',
        'Practice proper hand placement'
      ]
    },
    'pull-ups': {
      reps: Math.floor(Math.random() * 15) + 5,
      feedback: [
        'Pull with your lats, not just your arms',
        'Control the negative portion of the rep',
        'Engage your core for stability'
      ],
      improvements: [
        'Work on lat pulldowns to build strength',
        'Practice dead hangs for grip strength',
        'Focus on full range of motion'
      ]
    },
    'sprint': {
      feedback: [
        'Drive your knees high during acceleration',
        'Pump your arms in sync with your stride',
        'Land on the balls of your feet'
      ],
      improvements: [
        'Work on explosive starts',
        'Practice high knee drills',
        'Strengthen your glutes and hamstrings'
      ]
    }
  }
  
  return {
    ...baseStats,
    ...(assessmentSpecific[assessmentType as keyof typeof assessmentSpecific] || assessmentSpecific['push-ups'])
  }
}

// Stats calculation utilities
export function calculateUserStats(sessions: AssessmentSession[]) {
  const completedSessions = sessions.filter(s => s.status === 'completed')
  
  // Calculate best score
  const bestScore = completedSessions.length > 0 
    ? Math.max(...completedSessions.map(s => s.stats?.overall_score || 0))
    : 0
  
  // Calculate average score
  const avgScore = completedSessions.length > 0
    ? completedSessions.reduce((acc, s) => acc + (s.stats?.overall_score || 0), 0) / completedSessions.length
    : 0
  
  // Calculate streak (simplified - based on completed sessions)
  const streak = Math.min(completedSessions.length, 7)
  
  // Calculate rank based on performance
  const rank = bestScore >= 90 ? Math.floor(Math.random() * 50) + 1 :
               bestScore >= 80 ? Math.floor(Math.random() * 100) + 50 :
               bestScore >= 70 ? Math.floor(Math.random() * 200) + 150 :
               bestScore > 0 ? Math.floor(Math.random() * 500) + 350 : 0
  
  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    bestScore: Math.round(bestScore),
    avgScore: Math.round(avgScore),
    streak,
    rank
  }
}

// Format utilities
export function formatDate(date: string | Date | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(parsedDate)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export function formatTime(date: string | Date | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Time'
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(parsedDate)
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid Time'
  }
}
