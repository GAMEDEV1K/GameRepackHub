"use client"

import React from 'react'
import Image from 'next/image'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  // Determinăm dimensiunea în funcție de prop-ul size
  const sizeMap = {
    small: { logo: 40, container: 'w-10 h-10' },
    medium: { logo: 60, container: 'w-16 h-16' },
    large: { logo: 80, container: 'w-20 h-20' }
  }
  
  const selectedSize = sizeMap[size]
  
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-game-dark/90 z-50' : ''}`}>
      <div className={`relative ${selectedSize.container} animate-pulse`}>
        {/* Logo-ul static în centru */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            src="/images/logo.svg" 
            alt="GameRipple Logo" 
            width={selectedSize.logo * 0.7} 
            height={selectedSize.logo * 0.7} 
            className="z-10"
          />
        </div>
        
        {/* Cercul animat în jurul logo-ului */}
        <div className="absolute inset-0">
          <div className="w-full h-full rounded-full border-4 border-transparent border-t-game-accent animate-spin"></div>
        </div>
      </div>
      
      {text && (
        <p className="mt-4 text-game-accent font-medium">{text}</p>
      )}
    </div>
  )
}
