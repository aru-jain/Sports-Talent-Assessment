'use client'

import { motion } from 'framer-motion'
import { 
  Activity, Play, Upload, Camera, CheckCircle, AlertCircle, 
  Clock, Users, Medal, ArrowLeft, Shield, Zap, Target, 
  FileVideo, RotateCcw, Eye, Download,
  Trophy
} from 'lucide-react'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { storage, generateMockStats, type AssessmentSession, type User } from '@/lib/utils'

const assessmentData = {
  id: 'push-ups',
  name: 'Push-ups',
  icon: Activity,
  color: 'bg-red-500',
  description: 'Upper body strength and endurance assessment',
  duration: '3-5 min',
  difficulty: 'Intermediate',
  participants: 1250,
  avgScore: 78,
  requirements: ['Flat surface', 'Proper form', 'Clear video angle'],
  instructions: [
    'Position yourself in a plank position with hands slightly wider than shoulders',
    'Keep your body straight from head to heels throughout the movement',
    'Lower your chest until it nearly touches the ground',
    'Push back up to the starting position with full arm extension',
    'Maintain consistent pace and proper form for accurate assessment'
  ],
  tips: [
    'Warm up with light stretching before starting',
    'Focus on quality over quantity for better scores',
    'Keep your core engaged throughout the exercise',
    'Breathe consistently - exhale on the push up'
  ]
}

export default function PushUpsAssessmentPage() {
  const [currentStep, setCurrentStep] = useState<'info' | 'upload' | 'processing' | 'results'>('info')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processingStep, setProcessingStep] = useState<'analyzing' | 'extracting' | 'transcoding' | 'complete'>('analyzing')
  const [mockResults, setMockResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedFile(file)
      }
    }
  }

  const startProcessing = () => {
    setCurrentStep('processing')
    
    // Simulate processing steps
    setTimeout(() => setProcessingStep('extracting'), 2000)
    setTimeout(() => setProcessingStep('transcoding'), 4000)
    setTimeout(() => setProcessingStep('complete'), 6000)
    setTimeout(() => {
      // Generate mock results
      const results = generateMockStats('push-ups')
      setMockResults(results)
      
      // Save assessment session
      const currentUser = storage.get<User>('currentUser')
      if (currentUser) {
        const session: AssessmentSession = {
          id: Date.now().toString(),
          userId: currentUser.id,
          assessmentType: 'push-ups',
          score: results.score,
          status: 'completed' as const,
          stats: results,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          duration: results.duration,
          reps: results.reps,
          feedback: results.feedback,
          videoUrl: URL.createObjectURL(uploadedFile!)
        }
        
        const existingSessions = storage.get<AssessmentSession[]>('userSessions') || []
        storage.set('userSessions', [...existingSessions, session])
      }
      
      setCurrentStep('results')
    }, 8000)
  }

  const resetAssessment = () => {
    setCurrentStep('info')
    setUploadedFile(null)
    setProcessingStep('analyzing')
    setMockResults(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-50 text-green-700 border-green-200'
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Advanced': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-surface text-muted border-border'
    }
  }

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/assessments">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${assessmentData.color} rounded-xl flex items-center justify-center`}>
              <assessmentData.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{assessmentData.name}</h1>
              <p className="text-muted">{assessmentData.description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assessment Info */}
      {currentStep === 'info' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border-light rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-foreground">{assessmentData.duration}</div>
                  <div className="text-sm text-muted">Duration</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border-light rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-foreground">{assessmentData.participants.toLocaleString()}</div>
                  <div className="text-sm text-muted">Athletes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border-light rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Medal className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-lg font-semibold text-foreground">{assessmentData.avgScore}%</div>
                  <div className="text-sm text-muted">Avg Score</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border-light rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(assessmentData.difficulty)}`}>
                    {assessmentData.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-surface border border-border-light rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Requirements
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {assessmentData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-surface border border-border-light rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Instructions
            </h3>
            <div className="space-y-3">
              {assessmentData.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-muted leading-relaxed">{instruction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pro Tips
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {assessmentData.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-primary-dark text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            onClick={() => setCurrentStep('upload')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200"
          >
            <Camera className="w-5 h-5" />
            Start Assessment
          </motion.button>
        </motion.div>
      )}

      {/* Upload Step */}
      {currentStep === 'upload' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Upload Your Video</h3>
              <p className="text-muted">Record yourself performing push-ups and upload the video</p>
            </div>
          </div>

          <div 
            className="border-2 border-dashed border-border-light rounded-2xl p-8 text-center space-y-4 bg-surface hover:bg-surface-dark transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileVideo className="w-12 h-12 text-primary mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">Click to upload video</p>
              <p className="text-muted">MP4, MOV, AVI up to 500MB</p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="video/*"
            className="hidden"
          />

          {uploadedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-primary-dark">{uploadedFile.name}</p>
                  <p className="text-sm text-primary-dark/70">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex space-x-4">
            <motion.button
              onClick={() => setCurrentStep('info')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-surface hover:bg-surface-dark text-foreground font-semibold py-3 px-6 rounded-2xl transition-all duration-200"
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={startProcessing}
              disabled={!uploadedFile}
              whileHover={{ scale: uploadedFile ? 1.02 : 1 }}
              whileTap={{ scale: uploadedFile ? 0.98 : 1 }}
              className={`flex-1 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 ${
                uploadedFile
                  ? 'bg-primary hover:bg-primary-dark text-black'
                  : 'bg-surface text-muted cursor-not-allowed'
              }`}
            >
              Process Video
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Processing Step */}
      {currentStep === 'processing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Processing Video</h3>
              <p className="text-muted">AI is analyzing your push-up performance</p>
            </div>
          </div>

          <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6">
            <div className="space-y-3 text-sm text-primary-dark">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Video uploaded and validated
              </p>
              <p className="flex items-center gap-2">
                {processingStep === 'analyzing' ? (
                  <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-primary" />
                )}
                AI pose detection and analysis
              </p>
              <p className="flex items-center gap-2">
                {processingStep === 'extracting' ? (
                  <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
                ) : processingStep === 'transcoding' || processingStep === 'complete' ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <div className="w-4 h-4 border border-border rounded-full" />
                )}
                Extracting semantic information
              </p>
              <p className="flex items-center gap-2">
                {processingStep === 'transcoding' ? (
                  <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
                ) : processingStep === 'complete' ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <div className="w-4 h-4 border border-border rounded-full" />
                )}
                Transcoding and chunking video
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Step */}
      {currentStep === 'results' && mockResults && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-black" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Assessment Complete!</h3>
              <p className="text-muted">Your push-up performance has been analyzed</p>
            </div>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-6 text-center">
            <div className="text-6xl font-bold text-black mb-2">{mockResults.score}</div>
            <div className="text-black/80 font-medium">Performance Score</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border-light rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockResults.reps}</div>
              <div className="text-sm text-muted">Push-ups</div>
            </div>
            <div className="bg-surface border border-border-light rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{mockResults.duration}s</div>
              <div className="text-sm text-muted">Duration</div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-surface border border-border-light rounded-2xl p-6 space-y-4">
            <h4 className="font-semibold text-foreground">AI Feedback</h4>
            <div className="space-y-3">
              {mockResults.feedback.map((item: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-muted text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              onClick={resetAssessment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-surface hover:bg-surface-dark text-foreground font-semibold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </motion.button>
            
            <Link href="/dashboard" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
