import React from 'react';
import { X, LayoutDashboard, Target, Users, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Sidebar({ isOpen, setIsOpen, activePage, setActivePage }) {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', name: 'Campaign List', icon: Target },
    { id: 'brief', name: 'Creative Brief', icon: Sparkles },
    { id: 'clients', name: 'Clients List', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Area */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform glass-panel border-y-0 border-l-0 rounded-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 overflow-y-auto flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              Nova
            </span>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2 flex-1">
          <div className="mb-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const current = activePage === item.id;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                  current
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1"
                )}
              >
                <Icon
                  className={cn(
                    "mr-4 flex-shrink-0 h-[18px] w-[18px] transition-colors",
                    current ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
