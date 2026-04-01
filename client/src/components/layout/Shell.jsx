import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Menu, Moon, Sun } from 'lucide-react';

export function Shell({ children, activePage, setActivePage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 relative">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-background to-purple-50 dark:from-background dark:via-background dark:to-indigo-950/20 -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header */}
        <header className="flex-shrink-0 glass-panel border-b-0 border-x-0 rounded-none sticky top-0 z-30">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden text-muted-foreground hover:text-foreground p-2 -ml-2 rounded-xl transition-colors hover:bg-muted"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-bold tracking-tight text-gradient hidden sm:block capitalize">
                {activePage === 'dashboard' ? 'Campaign Dashboard' : activePage.replace('-', ' ')}
              </h1>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="h-6 w-px bg-border mx-1"></div>

              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">Alex Morgan</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-background shadow-md">
                  AM
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Payload */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
