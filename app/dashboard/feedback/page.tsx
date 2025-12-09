'use client'

import { motion } from 'framer-motion'
import { 
  Upload, Play, Download, MessageSquare, Video, 
  CheckCircle, Clock, ArrowRight, FileVideo, Zap,
  Eye, RotateCcw, AlertCircle
} from 'lucide-react'
import { useState, useRef } from 'react'

type ProcessingStep = 'upload' | 'analyzing' | 'generating' | 'complete'

export default function FeedbackPage() {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        return
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        return
      }
      
      setUploadedFile(file)
    }
  }

  const startProcessing = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    setCurrentStep('analyzing')
    setProcessingProgress(0)
    
    // Simulate AI processing steps
    const steps = [
      { message: 'Analyzing video content...', duration: 2000 },
      { message: 'Detecting movement patterns...', duration: 2500 },
      { message: 'Generating form corrections...', duration: 2000 },
      { message: 'Creating annotated feedback video...', duration: 3000 },
      { message: 'Applying voice-over guidance...', duration: 1500 },
      { message: 'Finalizing feedback video...', duration: 1000 }
    ]
    
    let progress = 0
    for (const [index, step] of steps.entries()) {
      if (index === 1) setCurrentStep('analyzing')
      if (index === 3) setCurrentStep('generating')
      
      await new Promise(resolve => setTimeout(resolve, step.duration))
      progress += 100 / steps.length
      setProcessingProgress(Math.min(progress, 100))
    }
    
    setCurrentStep('complete')
    setIsProcessing(false)
  }

  const resetProcess = () => {
    setCurrentStep('upload')
    setUploadedFile(null)
    setProcessingProgress(0)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadFeedbackVideo = () => {
    // Create a download link for the hardcoded video
    const link = document.createElement('a')
    link.href = '/pushup.mp4'
    link.download = 'feedback-video.mp4'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openVideoInNewTab = () => {
    window.open('/pushup.mp4', '_blank')
  }

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-foreground">AI Video Feedback</h1>
        <p className="text-muted">Upload your training video and get personalized AI feedback with form corrections</p>
      </motion.div>

      {/* Process Steps Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center justify-center space-x-2 mb-8"
      >
        {['upload', 'analyzing', 'generating', 'complete'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              currentStep === step ? 'bg-primary text-black' :
              ['upload', 'analyzing', 'generating', 'complete'].indexOf(currentStep) > index ? 'bg-primary text-black' :
              'bg-surface text-muted'
            }`}>
              {['upload', 'analyzing', 'generating', 'complete'].indexOf(currentStep) > index ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < 3 && (
              <div className={`w-8 h-0.5 mx-2 transition-colors ${
                ['upload', 'analyzing', 'generating', 'complete'].indexOf(currentStep) > index ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Content based on current step */}
      {currentStep === 'upload' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Upload Area */}
          <div className="bg-surface border border-border-light rounded-2xl p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
                {uploadedFile ? (
                  <CheckCircle className="w-10 h-10 text-primary" />
                ) : (
                  <Upload className="w-10 h-10 text-primary" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {uploadedFile ? 'Video Selected' : 'Upload Training Video'}
                </h3>
                {uploadedFile ? (
                  <div className="space-y-2">
                    <p className="text-muted">File: {uploadedFile.name}</p>
                    <p className="text-muted">Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <p className="text-muted">Upload your training video to get AI-powered form analysis and feedback</p>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-surface-dark hover:bg-olive-deep text-foreground font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <FileVideo className="w-5 h-5" />
                  {uploadedFile ? 'Change Video' : 'Select Video'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-surface border border-border-light rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              What You'll Get
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-foreground">Annotated video with form corrections highlighted</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-foreground">Voice-over feedback explaining improvements</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-foreground">Personalized training recommendations</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-foreground">Performance metrics and analysis</span>
              </div>
            </div>
          </div>

          {/* Video Requirements */}
          <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-primary mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-primary-dark">Video Requirements</h4>
                <ul className="text-sm text-primary-dark/80 space-y-1">
                  <li>• Clear view of your full body during exercise</li>
                  <li>• Good lighting and stable camera position</li>
                  <li>• Duration: 30 seconds to 5 minutes</li>
                  <li>• Supported formats: MP4, MOV, AVI</li>
                  <li>• Maximum file size: 100MB</li>
                </ul>
              </div>
            </div>
          </div>

          {uploadedFile && (
            <motion.button
              onClick={startProcessing}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Generate AI Feedback
                  <Zap className="w-5 h-5" />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      )}

      {(currentStep === 'analyzing' || currentStep === 'generating') && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center"
        >
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {currentStep === 'analyzing' ? 'Analyzing Your Form' : 'Generating Feedback Video'}
            </h3>
            <p className="text-muted">
              {currentStep === 'analyzing' 
                ? 'Our AI is analyzing your movement patterns and form...'
                : 'Creating your personalized feedback video with corrections...'
              }
            </p>
          </div>

          <div className="bg-surface border border-border-light rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Progress</span>
                <span className="text-primary font-semibold">{Math.round(processingProgress)}%</span>
              </div>
              <div className="w-full bg-surface-dark rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${processingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-primary-50 border border-primary/20 rounded-2xl p-6">
            <div className="space-y-3 text-sm text-primary-dark">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Video uploaded and processed
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                AI pose detection completed
              </p>
              <p className="flex items-center gap-2">
                {currentStep === 'generating' ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
                )}
                Form analysis and feedback generation
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {currentStep === 'complete' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-black" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Feedback Video Ready!</h3>
              <p className="text-muted">Your personalized AI feedback video has been generated</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="bg-surface border border-border-light rounded-2xl p-6">
            <div className="aspect-video bg-surface-dark rounded-xl overflow-hidden mb-4 relative">
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted">Loading video...</p>
                  </div>
                </div>
              )}
              <video 
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  outline: 'none',
                  border: 'none',
                  background: 'transparent'
                }}
                onError={(e) => {
                  console.error('Video error:', e)
                  setVideoLoaded(true) // Show error state
                }}
                onLoadStart={() => {
                  console.log('Video loading started')
                  setVideoLoaded(false)
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully')
                  setVideoLoaded(true)
                }}
                onCanPlay={() => {
                  console.log('Video can play')
                  setVideoLoaded(true)
                }}
              >
                <source src="/pushup.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">AI Feedback Video</h4>
                <p className="text-sm text-muted">Includes form analysis and voice guidance</p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={openVideoInNewTab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-surface-dark hover:bg-olive-deep rounded-lg transition-colors"
                  title="Open video in new tab"
                >
                  <Eye className="w-4 h-4 text-foreground" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Feedback Summary */}
          <div className="bg-surface border border-border-light rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4">Key Improvements Identified</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h5 className="font-medium text-foreground">Form Correction</h5>
                  <p className="text-sm text-muted">Keep your core engaged throughout the movement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h5 className="font-medium text-foreground">Tempo Adjustment</h5>
                  <p className="text-sm text-muted">Slow down the descent for better muscle activation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h5 className="font-medium text-foreground">Range of Motion</h5>
                  <p className="text-sm text-muted">Ensure full extension at the top of each rep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          {/* <div className="bg-primary-50 border border-primary/20 rounded-2xl p-4"> */}
            {/* <div className="flex items-start space-x-3"> */}
              {/* <Video className="w-5 h-5 text-primary mt-0.5" /> */}
              {/* <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-primary-dark text-sm">Video Playback Options</h4>
                <p className="text-xs text-primary-dark/80 leading-relaxed">
                  If the video doesn't play inline, try these alternatives:
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={openVideoInNewTab}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-xs bg-primary text-black px-3 py-1 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Open in New Tab
                  </motion.button>
                  <a 
                    href="/pushup.mp4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-surface text-foreground px-3 py-1 rounded-lg font-medium hover:bg-surface-dark transition-colors"
                  >
                    Direct Link
                  </a>
                </div>
              </div> */}
            {/* </div> */}
          {/* </div> */}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={downloadFeedbackVideo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </motion.button>
            
            <motion.button
              onClick={resetProcess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface-dark hover:bg-olive-deep text-foreground font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Video
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
