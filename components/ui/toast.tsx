// This file is no longer used - we're now using simple-toast.tsx instead
// This is just a placeholder to prevent TypeScript errors

"use client"

import React from "react"

// Simple exports to prevent import errors
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastViewport = () => null
export const Toast = () => null
export const ToastTitle = () => null
export const ToastDescription = () => null
export const ToastClose = () => null
export const ToastAction = () => null

export type ToastProps = {}
export type ToastActionElement = React.ReactNode
