'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import axios from 'axios'
import { Check, ChevronDown, UserPlus, Users, Heart, UserMinus } from 'lucide-react'
import { useMediaQuery } from '@/app/hooks/use-media-query'

interface ConnectButtonProps {
  toUserId: string
  initialConnectionStatus?: boolean
  // userName?: string
}

type ConnectionLevel = 'known' | 'closer' | 'closest'

const levelIcons = {
  known: UserPlus,
  closer: Users,
  closest: Heart,
}

export default function ConnectButton({
  toUserId,
  initialConnectionStatus = false,
  // userName = 'this user'
}: ConnectButtonProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [connectionLevel, setConnectionLevel] = useState<ConnectionLevel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(initialConnectionStatus)
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleConnect = async () => {
    if (!connectionLevel) return

    setIsLoading(true)
    try {
      const res = await axios.post("/api/user/connectusers", {
        toUserId,
        level: connectionLevel
      })

      console.log("Response:", res.data)

      toast.success("Connection request sent!", {
        description: `You've sent a ${connectionLevel} connection request.`,
      })
      setConnectionLevel(null)
      setIsSelecting(false)
      setIsConnected(true)
    } catch (error) {
      console.error("Error sending connection request:", error)

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data.error === "A connection request already exists between these users") {
          toast.error("Connection request already exists", {
            description: "You've already sent a connection request with this user."
          })
        } else if (error.response.status === 401) {
          toast.error("Unauthorized", {
            description: "Please log in to send a connection request."
          })
        } else {
          toast.error("Failed to send connection request", {
            description: error.response.data.error || "An unexpected error occurred. Please try again later."
          })
        }
      } else {
        toast.error("Failed to send connection request", {
          description: "An unexpected error occurred. Please try again later."
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await axios.post("/api/user/disconnect", { toUserId })
      toast.success("Disconnected successfully", {
        description: `You've disconnected`
        // description: `You've disconnected from ${userName}.`
      })
      setIsConnected(false)
    } catch (error) {
      console.error("Error disconnecting:", error)
      toast.error("Failed to disconnect", {
        description: "An unexpected error occurred. Please try again later."
      })
    } finally {
      setIsLoading(false)
      setShowDisconnectModal(false)
    }
  }

  const handleHoldStart = () => {
    if (isDesktop) {
      setShowDisconnectModal(true)
    } else {
      setIsHolding(true)
      holdTimeoutRef.current = setTimeout(() => {
        handleDisconnect()
      }, 3000)
    }
  }

  const handleHoldEnd = () => {
    if (!isDesktop) {
      setIsHolding(false)
      setHoldProgress(0)
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
      }
    }
  }

  useEffect(() => {
    let animationFrame: number
    if (isHolding) {
      const startTime = Date.now()
      const animate = () => {
        const elapsedTime = Date.now() - startTime
        setHoldProgress(Math.min(elapsedTime / 3000, 1))
        if (elapsedTime < 3000) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      animationFrame = requestAnimationFrame(animate)
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isHolding])

  const LevelIcon = connectionLevel ? levelIcons[connectionLevel] : ChevronDown

  if (isConnected) {
    return (
      <>
        <Button
          variant="destructive"
          className="w-full sm:w-auto relative overflow-hidden"
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
          disabled={isLoading}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Disconnect
          {isHolding && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${holdProgress * 100}%` }}
            />
          )}
        </Button>
        {isHolding && (
          <motion.div
            className="absolute left-0 right-0 text-center text-sm text-red-500 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            You are about to disconnect
          </motion.div>
        )}
        <Dialog open={showDisconnectModal} onOpenChange={setShowDisconnectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Disconnection</DialogTitle>
              <DialogDescription>
                Are you sure you want to disconnect? To connect back, you'll need to send a new request.
                {/* Are you sure you want to disconnect from {userName}? To connect back, you'll need to send a new request. */}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowDisconnectModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
                {isLoading ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="relative">
      <Button
        variant={connectionLevel ? "default" : "outline"}
        className="w-full sm:w-auto"
        onClick={() => connectionLevel ? handleConnect() : setIsSelecting(!isSelecting)}
        disabled={isLoading}
      >
        {isLoading ? (
          <motion.div
            className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <LevelIcon className="mr-2 h-4 w-4" />
            {connectionLevel ? `Connect as ${connectionLevel}` : "Connect"}
          </>
        )}
      </Button>
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 p-2 bg-popover border rounded-md shadow-md w-full sm:w-auto"
          >
            {(['known', 'closer', 'closest'] as const).map((level) => (
              <motion.button
                key={level}
                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${connectionLevel === level ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                onClick={() => {
                  setConnectionLevel(level)
                  setIsSelecting(false)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {React.createElement(levelIcons[level], { className: "mr-2 h-4 w-4" })}
                {level.charAt(0).toUpperCase() + level.slice(1)}
                {connectionLevel === level && <Check className="ml-auto h-4 w-4" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}