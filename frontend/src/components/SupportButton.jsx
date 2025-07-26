import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, VideoOff, Users, Clock, Shield, X } from 'lucide-react'
import { AuthContext } from '@context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SupportButton = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supportOptions = [
    {
      id: 'peer-support',
      title: 'Peer Support Call',
      description: 'Connect with a trained peer supporter',
      icon: Users,
      waitTime: '2-5 minutes',
      available: true,
      anonymous: true
    },
    {
      id: 'group-session',
      title: 'Group Support Session',
      description: 'Join an ongoing group support session',
      icon: Users,
      waitTime: 'Join immediately',
      available: true,
      anonymous: true
    },
    {
      id: 'professional',
      title: 'Professional Counselor',
      description: 'Speak with a licensed mental health professional',
      icon: Shield,
      waitTime: '10-15 minutes',
      available: false,
      premium: true,
      anonymous: false
    }
  ]

  const handleSupportRequest = async (optionId) => {
    setIsLoading(true)
    
    try {
      // Simulate API call to request support
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate room ID
      const roomId = `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Track support request
      if (window.gtag) {
        window.gtag('event', 'support_requested', {
          event_category: 'support',
          event_label: optionId,
          user_id: user?.id
        })
      }
      
      // Navigate to call room
      navigate(`/feed/call/${roomId}`, {
        state: {
          supportType: optionId,
          isSupporter: false,
          anonymous: supportOptions.find(opt => opt.id === optionId)?.anonymous
        }
      })
      
      setIsModalOpen(false)
      toast.success('Connecting you to support...')
      
    } catch (error) {
      console.error('Failed to request support:', error)
      toast.error('Failed to connect. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Support Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-200"
        title="Get live support"
      >
        <Video className="w-4 h-4" />
        <span className="hidden sm:inline">Talk Now</span>
        
        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </motion.button>

      {/* Support Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Live Support
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect with someone who understands
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Important Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                          Safe & Confidential
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          All conversations are private and secure. Our supporters are trained volunteers and professionals.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Support Options */}
                  <div className="space-y-3">
                    {supportOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <div
                          key={option.id}
                          className={`
                            relative border rounded-lg p-4 transition-all duration-200
                            ${option.available 
                              ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10' 
                              : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`
                                flex items-center justify-center w-10 h-10 rounded-lg
                                ${option.available ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-600 text-gray-400'}
                              `}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {option.title}
                                  </h3>
                                  {option.premium && (
                                    <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
                                      Premium
                                    </span>
                                  )}
                                  {option.anonymous && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                                      Anonymous
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {option.description}
                                </p>
                                <div className="flex items-center space-x-1 mt-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {option.waitTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              {option.available ? (
                                <button
                                  onClick={() => handleSupportRequest(option.id)}
                                  disabled={isLoading}
                                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? 'Connecting...' : 'Connect'}
                                </button>
                              ) : (
                                <div className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-lg">
                                  Unavailable
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Disclaimer */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p>
                      <strong>Disclaimer:</strong> This service provides peer support and is not a substitute for professional mental health treatment. 
                      If you're in crisis, please use the emergency support options or contact emergency services.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-2xl border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {supportOptions.filter(opt => opt.available).length} supporters online
                      </span>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SupportButton