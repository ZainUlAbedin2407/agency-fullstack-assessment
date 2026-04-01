import React from 'react';
import { cn } from '@/utils/cn';

export function KPICard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel p-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 ease-out border-white/40 dark:border-white/5">
      {/* Decorative gradient blob background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h3 className="tracking-tight text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          <div className="p-2.5 bg-primary/5 dark:bg-primary/10 rounded-xl group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {value}
          </div>
          {trend && (
            <div className="flex items-center mt-3 space-x-2">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold",
                trend === 'up' 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
                  : trend === 'down' 
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" 
                    : "bg-muted text-muted-foreground"
              )}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
              </span>
              <span className="text-xs text-muted-foreground font-medium">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
