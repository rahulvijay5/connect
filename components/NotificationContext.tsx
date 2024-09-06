'use client'

import React, { createContext, useContext, useState } from 'react'

type NotificationContextType = {
    isMinimized: boolean;
    toggleMinimize: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [isMinimized, setIsMinimized] = useState(false)

    const toggleMinimize = () => setIsMinimized(!isMinimized)

    return (
        <NotificationContext.Provider value={{ isMinimized, toggleMinimize }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}