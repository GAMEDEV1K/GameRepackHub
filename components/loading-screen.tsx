"use client"

import React from 'react'
import LoadingSpinner from './ui/loading-spinner'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-game-dark/95 flex items-center justify-center z-50">
      <LoadingSpinner size="large" text="Loading GameRipple..." fullScreen={true} />
    </div>
  )
}
