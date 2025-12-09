'use client'

import { motion } from 'framer-motion'
import { Activity, Play, Clock, Medal, Users, TrendingUp, Target, Zap, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'strength', name: 'Strength', count: 4 },
    { id: 'cardio', name: 'Cardio', count: 2 },
    { id: 'agility', name: 'Agility', count: 2 }
  ]

  const assessmentTypes = [
    {
      id: 'push-ups',
      name: 'Push-ups',
      category: 'strength',
      icon: Activity,
      color: 'bg-red-500',
      description: 'Upper body strength and endurance assessment',
      duration: '3-5 min',
      difficulty: 'Intermediate',
      participants: 1250,
      avgScore: 78,
      requirements: ['Flat surface', 'Proper form', 'Clear video angle'],
      instructions: 'Perform maximum push-ups with proper form. Keep your body straight from head to heels.'
    },
    {
      id: 'pull-ups',
      name: 'Pull-ups',
      category: 'strength',
      icon: TrendingUp,
      color: 'bg-blue-500',
      description: 'Back and arm strength evaluation',
      duration: '2-4 min',
      difficulty: 'Advanced',
      participants: 890,
      avgScore: 65,
      requirements: ['Pull-up bar', 'Full extension', 'Clear side view'],
      instructions: 'Perform maximum pull-ups with full range of motion. Start from dead hang.'
    },
    {
      id: 'sit-ups',
      name: 'Sit-ups',
      category: 'strength',
      icon: Target,
      color: 'bg-primary',
      description: 'Core strength and endurance test',
      duration: '2-3 min',
      difficulty: 'Beginner',
      participants: 2100,
      avgScore: 82,
      requirements: ['Flat surface', 'Proper form', 'Side angle view'],
      instructions: 'Perform maximum sit-ups in the given time. Keep your feet flat on the ground.'
    },
    {
      id: 'lunges',
      name: 'Lunges',
      category: 'strength',
      icon: Zap,
      color: 'bg-purple-500',
      description: 'Lower body stability and strength test',
      duration: '4-6 min',
      difficulty: 'Intermediate',
      participants: 670,
      avgScore: 71,
      requirements: ['Open space', 'Proper depth', 'Front view'],
      instructions: 'Alternate leg lunges with proper depth and balance. Maintain upright posture.'
    },
    {
      id: 'sprint',
      name: '50m Sprint',
      category: 'cardio',
      icon: Medal,
      color: 'bg-amber-500',
      description: 'Speed and acceleration assessment',
      duration: '1-2 min',
      difficulty: 'Intermediate',
      participants: 1540,
      avgScore: 74,
      requirements: ['50m track', 'Timer', 'Side view recording'],
      instructions: 'Run 50 meters at maximum speed. Start from standing position.'
    },
    {
      id: 'burpees',
      name: 'Burpees',
      category: 'cardio',
      icon: Activity,
      color: 'bg-orange-500',
      description: 'Full body cardiovascular endurance',
      duration: '3-5 min',
      difficulty: 'Advanced',
      participants: 980,
      avgScore: 69,
      requirements: ['Open space', 'Full movement', 'Clear full body view'],
      instructions: 'Perform maximum burpees with proper form. Complete all movement phases.'
    },
    {
      id: 'agility-ladder',
      name: 'Agility Ladder',
      category: 'agility',
      icon: Zap,
      color: 'bg-cyan-500',
      description: 'Foot speed and coordination test',
      duration: '2-3 min',
      difficulty: 'Intermediate',
      participants: 450,
      avgScore: 76,
      requirements: ['Agility ladder', 'Clear foot view', 'Side recording'],
      instructions: 'Complete agility ladder drills with speed and precision. Avoid touching rungs.'
    },
    {
      id: 'cone-drill',
      name: '5-10-5 Cone Drill',
      category: 'agility',
      icon: Target,
      color: 'bg-indigo-500',
      description: 'Change of direction and agility assessment',
      duration: '1-2 min',
      difficulty: 'Advanced',
      participants: 320,
      avgScore: 68,
      requirements: ['3 cones', '5-yard spacing', 'Overhead view'],
      instructions: 'Sprint between cones touching each line. Complete the pattern as fast as possible.'
    }
  ]

  const filteredAssessments = selectedCategory === 'all' 
    ? assessmentTypes 
    : assessmentTypes.filter(a => a.category === selectedCategory)

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
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-foreground">SAI Assessments</h1>
        <p className="text-muted">Choose an assessment to start your performance evaluation</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex space-x-2 overflow-x-auto pb-2"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-surface text-muted hover:bg-surface-dark hover:text-foreground'
            }`}
          >
            {category.name} ({category.count})
          </motion.button>
        ))}
      </motion.div>

      {/* Featured Assessment */}
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Featured Assessment</h3>
              <p className="text-muted">Most popular this week</p>
            </div>
          </div>
        </div>
        
        <div className="relative bg-surface-dark border border-border-light rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-1 text-foreground">Push-ups Challenge</h4>
              <p className="text-muted text-sm">Test your upper body strength</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">1,250+</div>
              <div className="text-muted text-sm">Athletes</div>
            </div>
          </div>
        </div>
        
        <Link href="/dashboard/assessments/push-ups" className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary-dark text-black font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            Start Assessment
            <Play className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Assessment Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-foreground">All Assessments</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredAssessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            >
              <Link href={`/dashboard/assessments/${assessment.id}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 ${assessment.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <assessment.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            {assessment.name}
                          </h4>
                          <ArrowRight className="w-5 h-5 text-muted" />
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {assessment.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(assessment.difficulty)}`}>
                          {assessment.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Clock className="w-3 h-3" />
                          {assessment.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Users className="w-3 h-3" />
                          {assessment.participants.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Medal className="w-3 h-3" />
                          Avg: {assessment.avgScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="bg-primary-50 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Medal className="w-6 h-6 text-primary mt-1" />
          <div className="space-y-2">
            <h4 className="font-semibold text-primary-dark">Official SAI Assessments</h4>
            <p className="text-sm text-primary-dark/80 leading-relaxed">
              These assessments are designed and validated by the Sports Authority of India. 
              Your performance will be evaluated using AI-powered analysis and contribute to national talent identification.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
