import React, { useState, useMemo, useRef } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Check, ChevronDown } from 'lucide-react';
import { calculateCTR, calculateROAS, formatCurrency, formatNumber } from '@/utils/metrics';
import { cn } from '@/utils/cn';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export function CampaignTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const statusOptions = ['All', 'Active', 'Paused'];

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, sortConfig, statusFilter]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1.5 h-[14px] w-[14px] text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="ml-1.5 h-[14px] w-[14px] text-primary" /> : 
      <ArrowDown className="ml-1.5 h-[14px] w-[14px] text-primary" />;
  };

  return (
    <div className="glass-panel rounded-2xl border-white/40 dark:border-white/5 pb-2">
      <div className="p-6 border-b border-white/20 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-md rounded-t-2xl">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Campaign Details</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your active media placements.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group w-full sm:w-[180px]" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-full h-10 px-3 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-input/60 rounded-xl text-sm font-medium transition-all hover:bg-white/80 dark:hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-foreground max-w-[90px] truncate">
                  {statusFilter === 'All' ? 'All Statuses' : statusFilter}
                </span>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isFilterOpen && "rotate-180")} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-card/95 backdrop-blur-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "flex items-center w-full justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      statusFilter === opt 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {opt === 'All' ? 'All Statuses' : opt}
                    {statusFilter === opt && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-muted/30 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors group" onClick={() => requestSort('name')}>
                <div className="flex items-center">Campaign Name {getSortIcon('name')}</div>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors group" onClick={() => requestSort('spend')}>
                <div className="flex items-center">Spend {getSortIcon('spend')}</div>
              </th>
              <th className="px-6 py-4 text-right">Impressions</th>
              <th className="px-6 py-4 text-right">Clicks</th>
              <th className="px-6 py-4 text-right">CTR</th>
              <th className="px-6 py-4 text-right">Convs.</th>
              <th className="px-6 py-4 text-right">Est. ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-card/20">
            {sortedAndFilteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-3 text-muted-foreground/30" />
                    <p className="text-[15px] font-medium text-foreground">No campaigns found.</p>
                    <p className="text-sm mt-1 text-muted-foreground">Try adjusting your status filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedAndFilteredData.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                    {campaign.name}
                    <div className="text-xs font-normal text-muted-foreground mt-0.5">{campaign.id} &middot; {campaign.platform}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider relative overflow-hidden",
                      campaign.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-500/30"
                    )}>
                      {campaign.status === "Active" && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />}
                      <span className={campaign.status === "Active" ? "ml-2" : ""}>{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{formatCurrency(campaign.spend)}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground"><span className="font-medium text-foreground">{formatNumber(campaign.impressions)}</span></td>
                  <td className="px-6 py-4 text-right text-muted-foreground"><span className="font-medium text-foreground">{formatNumber(campaign.clicks)}</span></td>
                  <td className="px-6 py-4 text-right font-medium">{calculateCTR(campaign.clicks, campaign.impressions)}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">{formatNumber(campaign.conversions)}</td>
                  <td className="px-6 py-4 text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
                    {calculateROAS(campaign.conversions, campaign.spend)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
