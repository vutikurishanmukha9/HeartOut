import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// Initial state
const initialState = {
  theme: THEMES.AUTO,
  systemTheme: 'light',
  effectiveTheme: 'light',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  colorBlindFriendly: false,
  preferences: {
    accentColor: 'primary',
    borderRadius: 'medium',
    density: 'comfortable'
  }
}

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  TOGGLE_REDUCED_MOTION: 'TOGGLE_REDUCED_MOTION',
  TOGGLE_HIGH_CONTRAST: 'TOGGLE_HIGH_CONTRAST',
  TOGGLE_COLOR_BLIND_FRIENDLY: 'TOGGLE_COLOR_BLIND_FRIENDLY',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  RESET_PREFERENCES: 'RESET_PREFERENCES'
}

// Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME: {
      const newTheme = action.payload
      const effectiveTheme = newTheme === THEMES.AUTO ? state.systemTheme : newTheme
      
      return {
        ...state,
        theme: newTheme,
        effectiveTheme
      }
    }

    case THEME_ACTIONS.SET_SYSTEM_THEME: {
      const systemTheme = action.payload
      const effectiveTheme = state.theme === THEMES.AUTO ? systemTheme : state.theme
      
      return {
        ...state,
        systemTheme,
        effectiveTheme
      }
    }

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      }

    case THEME_ACTIONS.TOGGLE_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: !state.reducedMotion
      }

    case THEME_ACTIONS.TOGGLE_HIGH_CONTRAST:
      return {
        ...state,
        highContrast: !state.highContrast
      }

    case THEME_ACTIONS.TOGGLE_COLOR_BLIND_FRIENDLY:
      return {
        ...state,
        colorBlindFriendly: !state.colorBlindFriendly
      }

    case THEME_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      }

    case THEME_ACTIONS.RESET_PREFERENCES:
      return {
        ...initialState,
        systemTheme: state.systemTheme,
        effectiveTheme: state.systemTheme
      }

    default:
      return state
  }
}

// Create context
const ThemeContext = createContext()

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem('heartout-theme-preferences')
        if (saved) {
          const preferences = JSON.parse(saved)
          
          // Set theme
          if (preferences.theme) {
            dispatch({ type: THEME_ACTIONS.SET_THEME, payload: preferences.theme })
          }
          
          // Set font size
          if (preferences.fontSize) {
            dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: preferences.fontSize })
          }
          
          // Set accessibility options
          if (preferences.reducedMotion) {
            dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
          }
          
          if (preferences.highContrast) {
            dispatch({ type: THEME_ACTIONS.TOGGLE_HIGH_CONTRAST })
          }
          
          if (preferences.colorBlindFriendly) {
            dispatch({ type: THEME_ACTIONS.TOGGLE_COLOR_BLIND_FRIENDLY })
          }
          
          // Set other preferences
          if (preferences.preferences) {
            dispatch({
              type: THEME_ACTIONS.UPDATE_PREFERENCES,
              payload: preferences.preferences
            })
          }
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error)
      }
    }

    loadPreferences()
  }, [])

  // Detect system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_SYSTEM_THEME,
        payload: e.matches ? THEMES.DARK : THEMES.LIGHT
      })
    }

    // Set initial system theme
    dispatch({
      type: THEME_ACTIONS.SET_SYSTEM_THEME,
      payload: mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT
    })

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Detect system motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    if (mediaQuery.matches && !state.reducedMotion) {
      dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
    }
  }, [])

  // Save preferences when state changes
  useEffect(() => {
    try {
      const preferences = {
        theme: state.theme,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        colorBlindFriendly: state.colorBlindFriendly,
        preferences: state.preferences
      }
      
      localStorage.setItem('heartout-theme-preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Error saving theme preferences:', error)
    }
  }, [state])

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement
    
    // Theme class
    root.className = root.className.replace(/\b(light|dark)\b/g, '')
    root.classList.add(state.effectiveTheme)
    
    // Font size class
    root.className = root.className.replace(/\bfont-size-(small|medium|large|xl)\b/g, '')
    root.classList.add(`font-size-${state.fontSize}`)
    
    // Accessibility classes
    if (state.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    if (state.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    if (state.colorBlindFriendly) {
      root.classList.add('color-blind-friendly')
    } else {
      root.classList.remove('color-blind-friendly')
    }
    
    // Preference classes
    root.className = root.className.replace(/\bacent-\w+\b/g, '')
    root.classList.add(`accent-${state.preferences.accentColor}`)
    
    root.className = root.className.replace(/\bradius-\w+\b/g, '')
    root.classList.add(`radius-${state.preferences.borderRadius}`)
    
    root.className = root.className.replace(/\bdensity-\w+\b/g, '')
    root.classList.add(`density-${state.preferences.density}`)
  }, [state])

  // Theme functions
  const setTheme = (theme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme })
  }

  const setFontSize = (size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size })
  }

  const toggleReducedMotion = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
  }

  const toggleHighContrast = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_HIGH_CONTRAST })
  }

  const toggleColorBlindFriendly = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_COLOR_BLIND_FRIENDLY })
  }

  const updatePreferences = (preferences) => {
    dispatch({ type: THEME_ACTIONS.UPDATE_PREFERENCES, payload: preferences })
  }

  const resetPreferences = () => {
    dispatch({ type: THEME_ACTIONS.RESET_PREFERENCES })
    localStorage.removeItem('heartout-theme-preferences')
  }

  // Utility functions
  const isDark = state.effectiveTheme === THEMES.DARK
  const isLight = state.effectiveTheme === THEMES.LIGHT
  const isAuto = state.theme === THEMES.AUTO

  const getThemeConfig = () => ({
    colors: {
      primary: isDark ? '#f0781f' : '#e15d15',
      secondary: isDark ? '#38bdf8' : '#0284c7',
      accent: isDark ? '#d946ef' : '#c026d3',
      background: isDark ? '#111827' : '#ffffff',
      surface: isDark ? '#1f2937' : '#f9fafb',
      text: isDark ? '#f9fafb' : '#111827'
    },
    animations: {
      duration: state.reducedMotion ? 0 : 300,
      ease: state.reducedMotion ? 'linear' : 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  })

  // Context value
  const value = {
    ...state,
    setTheme,
    setFontSize,
    toggleReducedMotion,
    toggleHighContrast,
    toggleColorBlindFriendly,
    updatePreferences,
    resetPreferences,
    isDark,
    isLight,
    isAuto,
    getThemeConfig,
    THEMES
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeContext }