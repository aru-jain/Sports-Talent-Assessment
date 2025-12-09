'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Trophy, Target, Calendar, Activity, Medal, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storage, type AssessmentSession, formatDate, calculateUserStats } from '@/lib/utils'

export default function ProgressPage() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    const userSessions = storage.get<AssessmentSession[]>('userSessions') || []
    // Show sessions that are completed or don't have a status (assume completed)
    setSessions(userSessions.filter(s => !s.status || s.status === 'completed'))
  }, [])

  // Calculate progress metrics
  const calculateProgress = () => {
    if (sessions.length < 2) return null

    const recent = sessions.slice(-5) // Last 5 sessions
    const previous = sessions.slice(-10, -5) // Previous 5 sessions

    const recentAvg = recent.reduce((acc, s) => acc + (s.stats?.overall_score || 0), 0) / recent.length
    const previousAvg = previous.length > 0 
      ? previous.reduce((acc, s) => acc + (s.stats?.overall_score || 0), 0) / previous.length 
      : recentAvg

    const improvement = recentAvg - previousAvg

    return {
      current: Math.round(recentAvg),
      previous: Math.round(previousAvg),
      improvement: Math.round(improvement),
      trend: improvement > 2 ? 'up' : improvement < -2 ? 'down' : 'stable'
    }
  }

  const progress = calculateProgress()

  // Get assessment type breakdown
  const getAssessmentBreakdown = () => {
    const breakdown: { [key: string]: { count: number; avgScore: number; bestScore: number } } = {}
    
    sessions.forEach(session => {
      const type = session.assessmentType || 'unknown'
      if (!breakdown[type]) {
        breakdown[type] = { count: 0, avgScore: 0, bestScore: 0 }
      }
      
      breakdown[type].count++
      breakdown[type].avgScore += session.stats?.overall_score || 0
      breakdown[type].bestScore = Math.max(breakdown[type].bestScore, session.stats?.overall_score || 0)
    })

    Object.keys(breakdown).forEach(type => {
      breakdown[type].avgScore = Math.round(breakdown[type].avgScore / breakdown[type].count)
    })

    return breakdown
  }

  const assessmentBreakdown = getAssessmentBreakdown()

  // Recent achievements
  const getAchievements = () => {
    const achievements = []
    
    if (sessions.length >= 5) {
      achievements.push({
        icon: Trophy,
        title: '5 Assessments Completed',
        description: 'Keep up the great work!',
        color: 'bg-amber-500'
      })
    }
    
    if (sessions.some(s => (s.stats?.overall_score || 0) >= 90)) {
      achievements.push({
        icon: Target,
        title: 'Excellence Achieved',
        description: 'Scored 90% or higher',
        color: 'bg-primary'
      })
    }
    
    if (progress && progress.improvement > 10) {
      achievements.push({
        icon: TrendingUp,
        title: 'Rapid Improvement',
        description: 'Improved by 10+ points',
        color: 'bg-blue-500'
      })
    }

    return achievements
  }

  const achievements = getAchievements()

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp
      case 'down': return ArrowDown
      default: return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-muted'
    }
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
        <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted">Monitor your performance improvement over time</p>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex space-x-2 overflow-x-auto pb-2"
      >
        {[
          { id: 'week', name: 'This Week' },
          { id: 'month', name: 'This Month' },
          { id: 'quarter', name: 'This Quarter' },
          { id: 'all', name: 'All Time' }
        ].map((period) => (
          <motion.button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              selectedPeriod === period.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-surface text-muted hover:bg-surface-dark hover:text-foreground'
            }`}
          >
            {period.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Progress Overview */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-surface border border-border-light rounded-3xl p-6 relative overflow-hidden"
        >
          {/* Subtle neon accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="relative flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Performance Trend</h3>
              <p className="text-muted">Recent vs Previous Sessions</p>
            </div>
            <div className={`p-3 bg-primary/10 border border-primary/20 rounded-2xl ${getTrendColor(progress.trend)}`}>
              {(() => {
                const TrendIcon = getTrendIcon(progress.trend)
                return <TrendIcon className="w-8 h-8 text-primary" />
              })()}
            </div>
          </div>
          
          <div className="relative grid grid-cols-2 gap-4">
            <div className="bg-surface-dark border border-border-light rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1 text-foreground">{progress.current}%</div>
              <div className="text-muted text-sm">Recent Average</div>
            </div>
            <div className="bg-surface-dark border border-border-light rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1 flex items-center gap-2 text-foreground">
                {progress.improvement > 0 ? '+' : ''}{progress.improvement}
                {(() => {
                  const TrendIcon = getTrendIcon(progress.trend)
                  return <TrendIcon className="w-6 h-6 text-primary" />
                })()}
              </div>
              <div className="text-muted text-sm">Improvement</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assessment Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">Assessment Performance</h3>
        
        <div className="space-y-3">
          {Object.entries(assessmentBreakdown).map(([type, data], index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground capitalize">
                      {type.replace('-', ' ')}
                    </h4>
                    <p className="text-sm text-muted">{data.count} sessions completed</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{data.bestScore}%</div>
                  <div className="text-sm text-muted">Best Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-semibold text-foreground">{data.avgScore}%</div>
                  <div className="text-sm text-muted">Average</div>
                </div>
                <div className="bg-surface rounded-xl p-3 text-center">
                  <div className="text-lg font-semibold text-foreground">{data.count}</div>
                  <div className="text-sm text-muted">Sessions</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">Recent Achievements</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Sessions Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">Recent Sessions</h3>
        
        <div className="space-y-3">
          {sessions.slice(-5).reverse().map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground capitalize">
                      {session.assessmentType.replace('-', ' ')}
                    </h4>
                    <p className="text-sm text-muted flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(session.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {session.stats?.overall_score}%
                  </div>
                  {session.stats?.reps && (
                    <div className="text-sm text-muted">{session.stats.reps} reps</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* No Data State */}
      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto">
            <TrendingUp className="w-10 h-10 text-muted" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Progress Data</h3>
            <p className="text-muted">Complete some assessments to see your progress here</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
