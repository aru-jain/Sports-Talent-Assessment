'use client'

import { motion } from 'framer-motion'
import { Activity, Play, Trophy, TrendingUp, Calendar, ArrowRight, Zap, Target, Medal, Clock, MessageSquare, Video } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { storage, type User, type AssessmentSession, calculateUserStats, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentSessions, setRecentSessions] = useState<AssessmentSession[]>([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    streak: 0,
    rank: 0
  })

  useEffect(() => {
    const userData = storage.get<User>('currentUser')
    const sessions = storage.get<AssessmentSession[]>('userSessions') || []
    
    setUser(userData)
    setRecentSessions(sessions.slice(-3).reverse())
    
    // Calculate stats using utility function
    const calculatedStats = calculateUserStats(sessions)
    setStats({
      totalSessions: calculatedStats.totalSessions,
      avgScore: calculatedStats.avgScore,
      streak: calculatedStats.streak,
      rank: calculatedStats.rank
    })
  }, [])

  const assessmentTypes = [
    {
      id: 'push-ups',
      name: 'Push-ups',
      icon: Activity,
      color: 'bg-red-500',
      description: 'Upper body strength assessment',
      duration: '3-5 min'
    },
    {
      id: 'pull-ups',
      name: 'Pull-ups',
      icon: TrendingUp,
      color: 'bg-blue-500',
      description: 'Back and arm strength test',
      duration: '2-4 min'
    },
    {
      id: 'sit-ups',
      name: 'Sit-ups',
      icon: Target,
      color: 'bg-primary',
      description: 'Core strength evaluation',
      duration: '2-3 min'
    },
    {
      id: 'lunges',
      name: 'Lunges',
      icon: Zap,
      color: 'bg-purple-500',
      description: 'Lower body stability test',
      duration: '4-6 min'
    },
    {
      id: 'sprint',
      name: 'Sprint',
      icon: Medal,
      color: 'bg-amber-500',
      description: 'Speed and agility assessment',
      duration: '1-2 min'
    }
  ]

  return (
    <div className="flex-1 px-6 py-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface border border-border-light rounded-3xl p-6 relative overflow-hidden"
      >
        {/* Subtle neon accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}!
            </h2>
            <p className="text-muted">
              Ready to push your limits today?
            </p>
          </div>
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="relative mt-6 grid grid-cols-2 gap-4">
          <div className="bg-surface-dark/50 border border-border rounded-2xl p-4">
            <div className="text-2xl font-bold text-foreground">{stats.totalSessions}</div>
            <div className="text-sm text-muted">Total Sessions</div>
          </div>
          <div className="bg-surface-dark/50 border border-border rounded-2xl p-4">
            <div className="text-2xl font-bold text-foreground">{stats.avgScore}%</div>
            <div className="text-sm text-muted">Avg Score</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Quick Start</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/assessments">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-surface border border-border-light rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Start Assessment</h4>
                <p className="text-sm text-muted leading-relaxed">
                  Begin a new performance evaluation
                </p>
              </motion.div>
            </Link>

            <Link href="/dashboard/feedback">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-surface border border-border-light rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-info rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">AI Feedback</h4>
                <p className="text-sm text-muted leading-relaxed">
                  Get personalized video feedback
                </p>
              </motion.div>
            </Link>
          </div>

          {/* Real-time Analysis - Featured */}
          <Link href="/dashboard/realtime">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
                  <Video className="w-7 h-7 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-foreground">Real-time Analysis</h4>
                    <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      LIVE
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Live camera feed with AI pose tracking and instant form feedback
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted" />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Assessment Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">SAI Assessments</h3>
          <Link href="/dashboard/assessments">
            <span className="text-primary font-medium text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
        
        <div className="space-y-3">
          {assessmentTypes.slice(0, 3).map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            >
              <Link href={`/dashboard/assessments/${assessment.id}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${assessment.color} rounded-xl flex items-center justify-center`}>
                      <assessment.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {assessment.name}
                      </h4>
                      <p className="text-sm text-muted mb-2">
                        {assessment.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assessment.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Medal className="w-3 h-3" />
                          Official SAI
                        </span>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-muted" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Recent Sessions</h3>
            <Link href="/dashboard/sessions">
              <span className="text-primary font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="bg-surface border border-border-light rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      session.status === 'completed' ? 'bg-primary' : 
                      session.status === 'processing' ? 'bg-amber-500' : 'bg-surface'
                    }`}>
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground capitalize">
                        {session.assessmentType ? session.assessmentType.replace('-', ' ') : 'Unknown'}
                      </h4>
                      <p className="text-sm text-muted">
                        {formatDate(session.completedAt || session.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {session.stats?.overall_score && (
                      <div className="text-lg font-bold text-primary">
                        {session.stats.overall_score}%
                      </div>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      session.status === 'completed' ? 'bg-primary-50 text-primary' :
                      session.status === 'processing' ? 'bg-amber-50 text-amber-600' :
                      'bg-surface text-muted'
                    }`}>
                      {session.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-surface border border-border-light rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Performance Overview</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.streak}</div>
            <div className="text-sm text-muted">Day Streak</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.rank > 0 ? `#${stats.rank}` : 'N/A'}
            </div>
            <div className="text-sm text-muted">National Rank</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
