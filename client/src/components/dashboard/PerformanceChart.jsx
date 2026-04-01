import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

export function PerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[380px] flex items-center justify-center text-muted-foreground glass-panel rounded-2xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="font-medium">No performance data available.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 rounded-xl shadow-xl dark:shadow-2xl z-50">
          <p className="text-sm font-bold text-foreground mb-2 pb-2 border-b border-border/50">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 py-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium text-muted-foreground capitalize">{entry.name}:</span>
              <span className="text-sm font-bold text-foreground ml-auto">
                {entry.value >= 1000 ? (entry.value / 1000).toFixed(1) + 'k' : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel border-white/40 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-sm group">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Performance Trend
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mt-0.5">30 Days</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Daily correlation of Impressions vs Clicks.</p>
        </div>
      </div>
      
      <div className="h-[340px] w-full  transition-opacity duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(val) => `${val >= 1000 ? (val / 1000) + 'k' : val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '13px', fontWeight: 600 }}
            />
            
            <Area 
              type="monotone" 
              name="Impressions"
              dataKey="impressions" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorImpressions)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
            />
            <Area 
              type="monotone" 
              name="Clicks"
              dataKey="clicks" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorClicks)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#0ea5e9" }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
