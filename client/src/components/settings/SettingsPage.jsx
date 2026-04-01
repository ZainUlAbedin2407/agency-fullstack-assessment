import React from 'react';
import { Settings, User, Bell, Shield, Paintbrush } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export function SettingsPage() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-2xl p-6 sm:px-8 border-white/40 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2" />

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Account <span className="text-primary">Settings</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            Manage your personal profile, notification preferences, and application themes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {['Appearance'].map((item, idx) => (
            <div key={item} className={`p-4 rounded-xl cursor-pointer transition-all ${idx === 0 ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground font-medium'}`}>
              {item}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
            <Paintbrush className="h-5 w-5 text-primary" /> Appearance
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/50">
              <div>
                <h4 className="font-bold text-sm">Theme Preference</h4>
                <p className="text-xs text-muted-foreground mt-1">Easily toggle between light and dark modes natively.</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg cursor-pointer hover:shadow-lg transition-all"
              >
                Switch to {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
