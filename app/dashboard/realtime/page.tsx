'use client'

import { motion } from 'framer-motion'
import { 
  Video, Play, Square, RotateCcw, Shield, Zap, Target, 
  Camera, ArrowLeft, Activity, TrendingUp, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePermissions } from '@/contexts/PermissionsContext'

declare global {
  interface Window {
    Pose: any
    Camera: any
  }
}

export default function RealtimePage() {
  const [isTracking, setIsTracking] = useState(false)
  const { permissions, requestPermissions } = usePermissions()
  const [isLoading, setIsLoading] = useState(false)
  const [pushupCount, setPushupCount] = useState(0)
  const [currentStage, setCurrentStage] = useState('ready')
  const [elbowAngle, setElbowAngle] = useState('--')
  const [bodyAngle, setBodyAngle] = useState('--')
  const [sessionTime, setSessionTime] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trackerRef = useRef<any>(null)
  const sessionStartRef = useRef<number | null>(null)

  // PushupTracker class (exact from HTML)
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        // Load MediaPipe scripts
        const scripts = [
          'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js', 
          'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js'
        ]

        for (const src of scripts) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = src
            script.crossOrigin = 'anonymous'
            script.onload = () => resolve()
            script.onerror = reject
            document.head.appendChild(script)
          })
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (window.Pose && window.Camera) {
          initializePushupTracker()
          setIsInitialized(true)
        }
      } catch (error) {
        console.error('Failed to load MediaPipe:', error)
      }
    }

    loadMediaPipe()
  }, [])

  const initializePushupTracker = () => {
    if (!videoRef.current || !canvasRef.current) return

    // Create PushupTracker class instance (exact from HTML)
    class PushupTracker {
      video: HTMLVideoElement
      canvas: HTMLCanvasElement
      ctx: CanvasRenderingContext2D
      pose: any
      camera: any
      isTracking: boolean
      counter: number
      stage: string | null

      constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
        this.video = video
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!
        this.pose = null
        this.camera = null
        this.isTracking = false
        this.counter = 0
        this.stage = null
        
        this.initializeMediaPipe()
        this.setupCanvas()
      }

      setupCanvas() {
        this.canvas.width = 640
        this.canvas.height = 480
      }

      initializeMediaPipe() {
        this.pose = new window.Pose({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
          }
        })

        this.pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        this.pose.onResults((results: any) => {
          if (this.isTracking) {
            this.processResults(results)
          }
        })

        this.camera = new window.Camera(this.video, {
          onFrame: async () => {
            if (this.isTracking) {
              await this.pose.send({ image: this.video })
            }
          },
          width: 640,
          height: 480
        })
      }

      calculateAngle(a: number[], b: number[], c: number[]): number {
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0])
        let angle = Math.abs(radians * 180.0 / Math.PI)
        
        if (angle > 180.0) {
          angle = 360 - angle
        }
        
        return angle
      }

      processResults(results: any) {
        if (!results.poseLandmarks) {
          this.clearCanvas()
          return
        }

        const landmarks = results.poseLandmarks
        
        // Get key landmarks (MediaPipe pose landmarks)
        const leftShoulder = [landmarks[11].x, landmarks[11].y]
        const leftElbow = [landmarks[13].x, landmarks[13].y]
        const leftWrist = [landmarks[15].x, landmarks[15].y]
        const leftHip = [landmarks[23].x, landmarks[23].y]

        // Calculate angles
        const elbowAngleCalc = this.calculateAngle(leftShoulder, leftElbow, leftWrist)
        const bodyAngleCalc = this.calculateAngle(leftElbow, leftShoulder, leftHip)

        // Update React state
        setElbowAngle(Math.round(elbowAngleCalc).toString())
        setBodyAngle(Math.round(bodyAngleCalc).toString())

        // Pushup detection logic (same as HTML)
        if (elbowAngleCalc > 160) {
          this.stage = "up"
          setCurrentStage("up")
        }
        if (elbowAngleCalc < 90 && this.stage === "up") {
          this.stage = "down"
          setCurrentStage("down")
          this.counter++
          setPushupCount(this.counter)
        }

        // Draw pose landmarks with dynamic coloring
        this.drawPoseLandmarks(results, elbowAngleCalc)
      }

      clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }

      drawPoseLandmarks(results: any, elbowAngle: number) {
        this.clearCanvas()

        // Determine colors based on elbow angle (exact logic from HTML)
        let jointColor, connectionColor
        if (elbowAngle < 85) {
          // Green when going down
          jointColor = [0, 255, 0]
          connectionColor = [0, 200, 0]
        } else {
          // Pink when arms extended (original colors)
          jointColor = [245, 117, 66]
          connectionColor = [245, 66, 230]
        }

        // Draw pose landmarks using exact HTML logic
        if (results.poseLandmarks) {
          this.drawConnections(results.poseLandmarks, connectionColor)
          this.drawLandmarks(results.poseLandmarks, jointColor)
        }
      }

      drawConnections(landmarks: any[], color: number[]) {
        // MediaPipe pose connections (exact from HTML reference)
        const connections = [
          [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
          [11, 23], [12, 24], [23, 24], // Torso
          [23, 25], [25, 27], [24, 26], [26, 28], // Legs
          [27, 29], [29, 31], [28, 30], [30, 32], // Feet
          [11, 12], [12, 24], [24, 23], [23, 11] // Additional torso connections
        ]

        this.ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        this.ctx.lineWidth = 3
        this.ctx.lineCap = 'round'

        connections.forEach(([start, end]) => {
          if (landmarks[start] && landmarks[end]) {
            const startX = landmarks[start].x * this.canvas.width
            const startY = landmarks[start].y * this.canvas.height
            const endX = landmarks[end].x * this.canvas.width
            const endY = landmarks[end].y * this.canvas.height

            this.ctx.beginPath()
            this.ctx.moveTo(startX, startY)
            this.ctx.lineTo(endX, endY)
            this.ctx.stroke()
          }
        })
      }

      drawLandmarks(landmarks: any[], color: number[]) {
        this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        
        landmarks.forEach((landmark: any) => {
          if (landmark) {
            const x = landmark.x * this.canvas.width
            const y = landmark.y * this.canvas.height
            
            this.ctx.beginPath()
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
            this.ctx.fill()
            
            // Add a subtle border for better visibility
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            this.ctx.lineWidth = 1
            this.ctx.stroke()
          }
        })
      }

      async startTracking() {
        try {
          this.isTracking = true
          setIsTracking(true)
          await this.camera.start()
        } catch (error) {
          console.error('Error starting tracking:', error)
          this.isTracking = false
          setIsTracking(false)
        }
      }

      stopTracking() {
        this.isTracking = false
        setIsTracking(false)
        this.camera.stop()
        this.clearCanvas()
      }

      reset() {
        this.counter = 0
        this.stage = null
        setPushupCount(0)
        setCurrentStage('ready')
        setElbowAngle('--')
        setBodyAngle('--')
        this.clearCanvas()
      }
    }

    trackerRef.current = new PushupTracker(videoRef.current, canvasRef.current)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && sessionStartRef.current) {
      interval = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - sessionStartRef.current!) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking])

  // Button handlers that use the tracker class
  const startTracking = async () => {
    if (!isInitialized || !trackerRef.current) {
      return
    }

    setIsLoading(true)
    sessionStartRef.current = Date.now()
    
    try {
      await trackerRef.current.startTracking()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const stopTracking = () => {
    if (trackerRef.current) {
      trackerRef.current.stopTracking()
    }
  }

  const resetSession = () => {
    if (trackerRef.current) {
      trackerRef.current.reset()
    }
    setSessionTime(0)
    sessionStartRef.current = null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'up': return 'text-primary'
      case 'down': return 'text-info'
      default: return 'text-muted'
    }
  }

  return (
    <div className="flex-1 px-4 py-4 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center space-x-4"
      >
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Real-time Analysis</h1>
          <p className="text-muted text-sm">Live AI pose tracking & form analysis</p>
        </div>
      </motion.div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-primary-50 border border-primary/20 rounded-2xl p-4"
      >
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h4 className="font-semibold text-primary-dark text-sm">Encrypted Live Session</h4>
            <p className="text-xs text-primary-dark/80">
              Your camera feed is processed locally with end-to-end encryption
            </p>
          </div>
        </div>
      </motion.div>

      {/* Video Feed - Bigger Camera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-surface border border-border-light rounded-2xl p-2"
      >
        <div className="relative w-full bg-surface-dark rounded-xl overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          />
          
          {/* Angle Display */}
          <div className="absolute top-3 right-3 bg-black/70 rounded-lg p-2 text-white text-xs font-mono">
            <div>Elbow: {elbowAngle}°</div>
            <div>Body: {bodyAngle}°</div>
          </div>

          {/* Form Indicator */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-primary transition-all duration-300 ${
            currentStage === 'down' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}>
            GOING DOWN!
          </div>

          {/* Status Overlay */}
          {!isTracking && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Camera className="w-12 h-12 text-white mx-auto" />
                <p className="text-white font-medium">
                  {isLoading ? 'Starting camera...' : 
                   !isInitialized ? 'Loading AI models...' : 'Camera ready'}
                </p>
                {!isInitialized && (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-surface border border-border-light rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">{pushupCount}</div>
          <div className="text-sm text-muted">Pushups</div>
        </div>
        
        <div className="bg-surface border border-border-light rounded-2xl p-4 text-center">
          <div className={`text-lg font-bold capitalize ${getStageColor(currentStage)}`}>
            {currentStage}
          </div>
          <div className="text-sm text-muted">Stage</div>
        </div>
        
        <div className="bg-surface border border-border-light rounded-2xl p-4 text-center">
          <div className="text-lg font-bold text-foreground">{formatTime(sessionTime)}</div>
          <div className="text-sm text-muted">Time</div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          {!isTracking ? (
            <motion.button
              onClick={startTracking}
              disabled={isLoading || !isInitialized}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 bg-primary hover:bg-primary-dark text-black font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Live Tracking
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={stopTracking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Square className="w-5 h-5" />
              Stop Tracking
            </motion.button>
          )}
        </div>

        <motion.button
          onClick={resetSession}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-surface-dark hover:bg-olive-deep text-foreground font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Session
        </motion.button>
      </motion.div>

      {/* Live Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">Live Features</h3>
        
        <div className="space-y-3">
          <div className="bg-surface border border-border-light rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Real-time Pose Detection</h4>
                <p className="text-sm text-muted">AI tracks 33 body landmarks in real-time</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-light rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-info rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Form Analysis</h4>
                <p className="text-sm text-muted">Instant feedback on exercise form and technique</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-light rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Rep Counting</h4>
                <p className="text-sm text-muted">Automatic repetition counting with accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-primary-50 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-primary mt-1" />
          <div className="space-y-2">
            <h4 className="font-semibold text-primary-dark">How to Use</h4>
            <ul className="text-sm text-primary-dark/80 space-y-1">
              <li>• Position yourself in full view of the camera</li>
              <li>• Ensure good lighting for accurate tracking</li>
              <li>• Start with arms extended (up position)</li>
              <li>• Perform pushups with proper form</li>
              <li>• Watch the real-time pose overlay and counter</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Performance Summary */}
      {pushupCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-surface border border-border-light rounded-2xl p-6"
        >
          <h4 className="font-semibold text-foreground mb-4">Session Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{pushupCount}</div>
              <div className="text-muted">Total Reps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {sessionTime > 0 ? Math.round(pushupCount / (sessionTime / 60)) : 0}
              </div>
              <div className="text-muted">Reps/Min</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
