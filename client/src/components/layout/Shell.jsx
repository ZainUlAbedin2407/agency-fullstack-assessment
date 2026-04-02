import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Standard backend running socket server

export function Shell({ children, activePage, setActivePage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    socket.on('receive_alert', (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 10)); // Keep the latest 10
    });
    return () => socket.off('receive_alert');
  }, []);

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

            <div className="flex items-center gap-4 sm:gap-5">
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors focus:ring-2 focus:ring-primary focus:outline-none relative"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-md shadow-red-500/50 border border-background"></span>
                    </span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/20">
                      <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                      <button onClick={() => setNotifications([])} className="text-xs text-primary font-bold hover:opacity-80 transition">Clear all</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                           <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                           <p className="text-sm font-semibold text-muted-foreground">All caught up!</p>
                           <p className="text-xs text-muted-foreground/70 mt-1">No new alerts to show right now.</p>
                        </div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div key={notif.id || idx} className="p-4 border-b border-border/40 hover:bg-muted/80 transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                               <h5 className="text-sm font-extrabold truncate text-foreground group-hover:text-primary transition-colors">{notif.title}</h5>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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
