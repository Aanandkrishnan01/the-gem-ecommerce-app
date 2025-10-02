import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/Button"
import { cn } from "../lib/utils"

// Enhanced theme toggle with better animations and design
export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 border-border hover:bg-accent">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Advanced theme toggle with three options and better UI
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 border-border hover:bg-accent">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="transition-transform duration-300 hover:scale-110">
          {getIcon()}
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[140px] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            <button
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                theme === "light" && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleThemeChange("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </button>
            <button
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                theme === "dark" && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleThemeChange("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </button>
            <button
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                theme === "system" && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleThemeChange("system")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </button>
          </div>
        </>
      )}
    </div>
  )
}