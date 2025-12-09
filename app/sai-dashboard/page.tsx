'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, Users, Trophy, TrendingUp, MapPin, Calendar, 
  Activity, Medal, Target, ArrowUp, ArrowDown, Filter,
  Eye, Download, Star, AlertTriangle
} from 'lucide-react'
import { useState, useEffect } from 'react'

// Mock data for SAI dashboard
const mockData = {
  overview: {
    totalAthletes: 12547,
    activeAssessments: 156,
    completedToday: 89,
    avgPerformance: 76.8,
    trends: {
      athletes: { value: 8.2, direction: 'up' },
      assessments: { value: 12.5, direction: 'up' },
      performance: { value: -2.1, direction: 'down' }
    }
  },
  topPerformers: [
    { id: 1, name: 'Rajesh Kumar', state: 'Punjab', sport: 'Athletics', score: 94.5, improvement: 12.3 },
    { id: 2, name: 'Priya Sharma', state: 'Haryana', sport: 'Wrestling', score: 92.8, improvement: 8.7 },
    { id: 3, name: 'Arjun Singh', state: 'Rajasthan', sport: 'Boxing', score: 91.2, improvement: 15.2 },
    { id: 4, name: 'Meera Patel', state: 'Gujarat', sport: 'Gymnastics', score: 90.6, improvement: 6.9 },
    { id: 5, name: 'Kiran Yadav', state: 'Maharashtra', sport: 'Swimming', score: 89.4, improvement: 11.1 }
  ],
  statePerformance: [
    { state: 'Punjab', athletes: 1245, avgScore: 82.3, rank: 1 },
    { state: 'Haryana', athletes: 1189, avgScore: 81.7, rank: 2 },
    { state: 'Maharashtra', athletes: 1456, avgScore: 80.9, rank: 3 },
    { state: 'Kerala', athletes: 987, avgScore: 80.2, rank: 4 },
    { state: 'Tamil Nadu', athletes: 1334, avgScore: 79.8, rank: 5 },
    { state: 'Karnataka', athletes: 1122, avgScore: 79.1, rank: 6 }
  ],
  assessmentStats: [
    { type: 'Push-ups', completed: 3456, avgScore: 78.2, trend: 'up' },
    { type: 'Pull-ups', completed: 2890, avgScore: 65.8, trend: 'down' },
    { type: 'Sprint', completed: 2134, avgScore: 82.1, trend: 'up' },
    { type: 'Sit-ups', completed: 4123, avgScore: 81.9, trend: 'up' }
  ],
  recentAlerts: [
    { id: 1, type: 'performance', message: 'Unusual drop in Maharashtra state average', time: '2 hours ago' },
    { id: 2, type: 'system', message: 'Server maintenance scheduled for tonight', time: '4 hours ago' },
    { id: 3, type: 'talent', message: '5 new high-potential athletes identified', time: '6 hours ago' }
  ]
}

export default function SAIDashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [data, setData] = useState(mockData)

  const timeframes = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' }
  ]

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? ArrowUp : ArrowDown
  }

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted">Sports Authority of India - Performance Monitoring</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {timeframes.map((timeframe) => (
            <motion.button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-muted hover:bg-surface-dark hover:text-foreground'
              }`}
            >
              {timeframe.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(data.overview.trends.athletes.direction)}`}>
              {(() => {
                const TrendIcon = getTrendIcon(data.overview.trends.athletes.direction)
                return <TrendIcon className="w-4 h-4" />
              })()}
              <span className="text-sm font-medium">{data.overview.trends.athletes.value}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {data.overview.totalAthletes.toLocaleString()}
          </div>
          <div className="text-sm text-muted">Total Athletes</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(data.overview.trends.assessments.direction)}`}>
              {(() => {
                const TrendIcon = getTrendIcon(data.overview.trends.assessments.direction)
                return <TrendIcon className="w-4 h-4" />
              })()}
              <span className="text-sm font-medium">{data.overview.trends.assessments.value}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {data.overview.activeAssessments}
          </div>
          <div className="text-sm text-muted">Active Assessments</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Today</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {data.overview.completedToday}
          </div>
          <div className="text-sm text-muted">Completed Today</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(data.overview.trends.performance.direction)}`}>
              {(() => {
                const TrendIcon = getTrendIcon(data.overview.trends.performance.direction)
                return <TrendIcon className="w-4 h-4" />
              })()}
              <span className="text-sm font-medium">{Math.abs(data.overview.trends.performance.value)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {data.overview.avgPerformance}%
          </div>
          <div className="text-sm text-muted">Avg Performance</div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Top Performers</h3>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4 text-foreground" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
              >
                <Download className="w-4 h-4 text-foreground" />
              </motion.button>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.topPerformers.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="flex items-center justify-between p-4 bg-surface rounded-2xl hover:bg-surface-dark transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{athlete.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {athlete.state}
                      </span>
                      <span>{athlete.sport}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{athlete.score}%</div>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +{athlete.improvement}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Alerts</h3>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {data.recentAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="flex items-start space-x-3 p-3 bg-surface rounded-xl"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  alert.type === 'performance' ? 'bg-amber-50' :
                  alert.type === 'system' ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  {alert.type === 'performance' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : alert.type === 'system' ? (
                    <Activity className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Star className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-muted mt-1">{alert.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* State Performance and Assessment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">State Performance</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
            >
              <Filter className="w-4 h-4 text-foreground" />
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {data.statePerformance.map((state, index) => (
              <motion.div
                key={state.state}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                className="flex items-center justify-between p-3 bg-surface rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{state.rank}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{state.state}</h4>
                    <p className="text-sm text-muted">{state.athletes.toLocaleString()} athletes</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{state.avgScore}%</div>
                  <div className="text-sm text-muted">Avg Score</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Assessment Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Assessment Statistics</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-surface hover:bg-surface-dark rounded-xl transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-foreground" />
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {data.assessmentStats.map((assessment, index) => (
              <motion.div
                key={assessment.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="p-4 bg-surface rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{assessment.type}</h4>
                  <div className={`flex items-center space-x-1 ${getTrendColor(assessment.trend)}`}>
                    {(() => {
                      const TrendIcon = getTrendIcon(assessment.trend)
                      return <TrendIcon className="w-4 h-4" />
                    })()}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{assessment.completed.toLocaleString()} completed</span>
                  <span className="font-semibold text-primary">{assessment.avgScore}% avg</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${assessment.avgScore}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
