'use client'

import { motion } from 'framer-motion'
import { Play, Calendar, Clock, Trophy, TrendingUp, Filter, Search, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storage, type AssessmentSession, formatDate, formatTime } from '@/lib/utils'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<AssessmentSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const userSessions = storage.get<AssessmentSession[]>('userSessions') || []
    setSessions(userSessions.reverse()) // Most recent first
    setFilteredSessions(userSessions)
  }, [])

  useEffect(() => {
    let filtered = sessions

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.assessmentType && session.assessmentType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSessions(filtered)
  }, [sessions, statusFilter, searchTerm])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200'
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-surface text-muted border-border'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-primary'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    avgScore: sessions.filter(s => s.stats?.overall_score)
      .reduce((acc, s) => acc + (s.stats?.overall_score || 0), 0) / 
      sessions.filter(s => s.stats?.overall_score).length || 0,
    thisMonth: sessions.filter(s => 
      new Date(s.createdAt).getMonth() === new Date().getMonth()
    ).length
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
        <h1 className="text-2xl font-bold text-foreground">Training Sessions</h1>
        <p className="text-muted">Track your assessment history and performance</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted">Total Sessions</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
              <div className="text-sm text-muted">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{Math.round(stats.avgScore) || 0}%</div>
              <div className="text-sm text-muted">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.thisMonth}</div>
              <div className="text-sm text-muted">This Month</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </motion.div>

      {/* Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-10 h-10 text-muted" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No sessions found</h3>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Start your first assessment to see sessions here'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground capitalize">
                      {session.assessmentType ? session.assessmentType.replace('-', ' ') : 'Unknown'} Assessment
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.completedAt || session.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(session.completedAt || session.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  {session.stats?.overall_score && (
                    <div className={`text-xl font-bold ${getScoreColor(session.stats.overall_score)}`}>
                      {session.stats.overall_score}%
                    </div>
                  )}
                  <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status || 'completed')}`}>
                    {session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Completed'}
                  </div>
                </div>
              </div>
              
              {/* Detailed Stats for Completed Sessions */}
              {session.status === 'completed' && session.stats && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{session.stats.form_score}%</div>
                      <div className="text-muted">Form</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{session.stats.speed_score}%</div>
                      <div className="text-muted">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{session.stats.endurance_score}%</div>
                      <div className="text-muted">Endurance</div>
                    </div>
                  </div>
                  
                  {session.stats.reps && (
                    <div className="mt-3 text-center">
                      <span className="text-primary font-semibold">{session.stats.reps} reps</span>
                      <span className="text-muted text-sm"> completed</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
