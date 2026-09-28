import React, { useState, useEffect } from 'react'
import { ThemeContext } from './theme.context.js'

export const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme === 'light' || savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', savedTheme)
                return savedTheme
            }
            const isSystemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
            const initialTheme = isSystemLight ? 'light' : 'dark'
            document.documentElement.setAttribute('data-theme', initialTheme)
            return initialTheme
        } catch {
            return 'dark'
        }
    })

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', theme)
            if (document.body) {
                document.body.setAttribute('data-theme', theme)
            }
            localStorage.setItem('theme', theme)
        } catch {
            // Storage access exception fallback
        }
    }, [ theme ])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
