import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/utils/cn';

export function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCustomApplied, setIsCustomApplied] = useState(false);

  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const presets = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Custom Range", value: "custom" },
  ];

  let currentLabel = presets.find(p => p.value === value)?.label || "Select range";
  if (value === 'custom' && isCustomApplied && startDate && endDate) {
    const formatStr = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    currentLabel = `${formatStr(startDate)} - ${formatStr(endDate)}`;
  }

  const handleSelect = (val) => {
    if (val !== 'custom') {
      onChange(val, null);
      setIsCustomApplied(false);
      setIsOpen(false);
    } else {
      onChange('custom', null);
    }
  };

  const applyCustomRange = () => {
    if (startDate && endDate) {
      setIsCustomApplied(true);
      onChange('custom', { start: startDate, end: endDate });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative group w-full sm:w-[260px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-[42px] px-3 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-white/80 dark:hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-foreground">{currentLabel}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full sm:w-[280px] bg-card border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {presets.map(item => (
              <button
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left outline-none focus:ring-2 focus:ring-primary/50",
                  value === item.value
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.label}
                {value === item.value && <Check className="h-4 w-4" />}
              </button>
            ))}

            {value === 'custom' && (
              <div className="pt-4 pb-2 px-2 mt-2 border-t border-border/60 animate-in slide-in-from-top-1 fade-in">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 pl-1">Select Dates</p>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground pl-1">START DATE</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground pl-1">END DATE</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <button
                  onClick={applyCustomRange}
                  disabled={!startDate || !endDate}
                  className="w-full bg-primary text-primary-foreground text-xs font-bold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-primary/20"
                >
                  Apply Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
