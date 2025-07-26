import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MessageCircle, ExternalLink, X, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const EmergencyBadge = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const emergencyContacts = [
    {
      id: 'suicide-prevention',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      region: 'US',
      type: 'crisis'
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis support via text',
      region: 'US',
      type: 'text'
    },
    {
      id: 'emergency',
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate life-threatening emergencies',
      region: 'US',
      type: 'emergency'
    },
    {
      id: 'samaritans',
      name: 'Samaritans',
      number: '116 123',
      description: 'Free emotional support, 24/7',
      region: 'UK',
      type: 'crisis'
    }
  ]

  const onlineResources = [
    {
      name: 'Crisis Chat',
      url: 'https://suicidepreventionlifeline.org/chat/',
      description: 'Online crisis chat support'
    },
    {
      name: 'Mental Health America',
      url: 'https://www.mhanational.org/finding-help',
      description: 'Find local mental health resources'
    },
    {
      name: 'NAMI Support',
      url: 'https://www.nami.org/Support-Education',
      description: 'Support groups and education'
    }
  ]

  const handleEmergencyClick = () => {
    // Animate the badge
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 200)
    
    // Open the emergency modal
    setIsModalOpen(true)
    
    // Track