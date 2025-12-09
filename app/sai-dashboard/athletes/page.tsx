'use client'

import { motion } from 'framer-motion'
import { 
  Users, Search, Filter, Download, Eye, Star, MapPin, 
  Trophy, Calendar, Activity, TrendingUp, Medal, Target
} from 'lucide-react'
import { useState } from 'react'

// Mock athlete data
const mockAthletes = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    age: 22,
    state: 'Punjab',
    sport: 'Athletics',
    specialization: '100m Sprint',
    overallScore: 94.5,
    recentImprovement: 12.3,
    sessionsCompleted: 45,
    rank: 1,
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'RK'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    age: 20,
    state: 'Haryana',
    sport: 'Wrestling',
    specialization: '55kg Category',
    overallScore: 92.8,
    recentImprovement: 8.7,
    sessionsCompleted: 38,
    rank: 2,
    status: 'active',
    joinDate: '2024-02-03',
    avatar: 'PS'
  },
  {
    id: 3,
    name: 'Arjun Singh',
    age: 24,
    state: 'Rajasthan',
    sport: 'Boxing',
    specialization: '75kg Category',
    overallScore: 91.2,
    recentImprovement: 15.2,
    sessionsCompleted: 52,
    rank: 3,
    status: 'active',
    joinDate: '2023-11-20',
    avatar: 'AS'
  },
  {
    id: 4,
    name: 'Meera Patel',
    age: 19,
    state: 'Gujarat',
    sport: 'Gymnastics',
    specialization: 'All-Around',
    overallScore: 90.6,
    recentImprovement: 6.9,
    sessionsCompleted: 41,
    rank: 4,
    status: 'active',
    joinDate: '2024-01-28',
    avatar: 'MP'
  },
  {
    id: 5,
    name: 'Kiran Yadav',
    age: 21,
    state: 'Maharashtra',
    sport: 'Swimming',
    specialization: '200m Freestyle',
    overallScore: 89.4,
    recentImprovement: 11.1,
    sessionsCompleted: 35,
    rank: 5,
    status: 'active',
    joinDate: '2024-03-10',
    avatar: 'KY'
  }
]

export default function AthletesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [sortBy, setSortBy] = useState('rank')

  const sports = ['all', 'Athletics', 'Wrestling', 'Boxing', 'Gymnastics', 'Swimming']
  const states = ['all', 'Punjab', 'Haryana', 'Rajasthan', 'Gujarat', 'Maharashtra']

  const filteredAthletes = mockAthletes
    .filter(athlete => 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(athlete => selectedSport === 'all' || athlete.sport === selectedSport)
    .filter(athlete => selectedState === 'all' || athlete.state === selectedState)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-primary'
    if (score >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive': return 'bg-red-50 text-red-700 border-red-200'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-surface text-muted border-border'
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Athletes Management</h1>
          <p className="text-muted">Monitor and manage athlete performance across India</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-surface hover:bg-surface-dark text-foreground rounded-xl transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Add Athlete
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search athletes by name or sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport}
              </option>
            ))}
          </select>
          
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            {states.map(state => (
              <option key={state} value={state}>
                {state === 'all' ? 'All States' : state}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Athletes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredAthletes.map((athlete, index) => (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{athlete.avatar}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{athlete.name}</h3>
                  <p className="text-sm text-muted">Age {athlete.age}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">#{athlete.rank}</span>
                </div>
                {athlete.rank <= 3 && (
                  <Star className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Sport</span>
                <span className="text-sm font-medium text-foreground">{athlete.sport}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Specialization</span>
                <span className="text-sm font-medium text-foreground">{athlete.specialization}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  State
                </span>
                <span className="text-sm font-medium text-foreground">{athlete.state}</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-surface rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Overall Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(athlete.overallScore)}`}>
                  {athlete.overallScore}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">+{athlete.recentImprovement}%</div>
                  <div className="text-muted">Improvement</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">{athlete.sessionsCompleted}</div>
                  <div className="text-muted">Sessions</div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(athlete.status)}`}>
                {athlete.status.charAt(0).toUpperCase() + athlete.status.slice(1)}
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-surface hover:bg-surface-dark rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-foreground" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  <Target className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Summary Statistics</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredAthletes.length}</div>
            <div className="text-sm text-muted">Total Athletes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(filteredAthletes.reduce((acc, a) => acc + a.overallScore, 0) / filteredAthletes.length)}%
            </div>
            <div className="text-sm text-muted">Avg Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {filteredAthletes.filter(a => a.overallScore >= 90).length}
            </div>
            <div className="text-sm text-muted">Top Performers</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAthletes.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-muted">Active</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
