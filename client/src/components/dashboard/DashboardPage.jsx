import React, { useState, useMemo } from 'react';
import { KPICard } from './KPICard';
import { PerformanceChart } from './PerformanceChart';
import { CampaignTable } from './CampaignTable';
import { DateRangePicker } from './DateRangePicker';
import { useCampaignData } from '@/hooks/useCampaignData';
import { calculateCTR, calculateROAS, formatCurrency, formatNumber } from '@/utils/metrics';
import { Coins, MousePointerClick, TrendingUp, Users, Target, Activity } from 'lucide-react';

export function DashboardPage() {
  const { data, loading, error } = useCampaignData();
  const [dateRange, setDateRange] = useState('30d');
  const [customDates, setCustomDates] = useState(null); // Custom range ke liye state

  // 1. Sabse pehle Data ko filter karein Date ke mutabiq
  const filteredData = useMemo(() => {
    if (!data) return [];
    const now = new Date();

    return data.filter((item) => {
      if (!item.date && !item.created_at) return dateRange === 'all' || true;
      const itemDate = new Date(item.created_at || item.date);
      if (isNaN(itemDate.getTime())) return false;

      if (dateRange === '7d') {
        const d = new Date();
        d.setDate(now.getDate() - 7);
        return itemDate >= d;
      }
      if (dateRange === '30d') {
        const d = new Date();
        d.setDate(now.getDate() - 30);
        return itemDate >= d;
      }
      if (dateRange === '90d') {
        const d = new Date();
        d.setDate(now.getDate() - 90);
        return itemDate >= d;
      }
      if (dateRange === 'custom' && customDates) {
        const start = new Date(customDates.start);
        const end = new Date(customDates.end);
        end.setHours(23, 59, 59, 999);
        return itemDate >= start && itemDate <= end;
      }
      return true; // Default behavior
    });
  }, [data, dateRange, customDates]);

  // 2. Aggregated Metrics
  const metrics = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    filteredData.forEach(camp => {
      totalSpend += camp.spend;
      totalImpressions += camp.impressions;
      totalClicks += camp.clicks;
      totalConversions += camp.conversions;
    });

    return {
      spend: totalSpend,
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      ctr: calculateCTR(totalClicks, totalImpressions),
      roas: calculateROAS(totalConversions, totalSpend),
    };
  }, [filteredData]);

  // 3. Chart Data
  const chartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const aggregated = {};
    filteredData.forEach(camp => {
      const rawDate = camp.created_at || camp.date;
      const parsedDate = new Date(rawDate);

      if (!isNaN(parsedDate.getTime())) {
        const dayStr = parsedDate.toISOString().split('T')[0];

        if (!aggregated[dayStr]) {
          aggregated[dayStr] = { date: dayStr, impressions: 0, clicks: 0 };
        }
        aggregated[dayStr].impressions += (camp.impressions || 0);
        aggregated[dayStr].clicks += (camp.clicks || 0);
      }
    });

    return Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Aggregating campaign metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel border-destructive/20 bg-destructive/5 text-destructive p-6 rounded-2xl flex flex-col items-center justify-center h-64 shadow-lg shadow-destructive/5">
        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <Activity className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-bold">Failed to load payload</h3>
        <p className="text-sm opacity-80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-2xl p-6 sm:px-8 border-white/40 dark:border-white/5 relative z-20">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Overview <span className="text-primary">Metrics</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            Analyzing {filteredData.length} active campaigns for the selected period.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          {/* Picker ko value aur onChange (dates ke sath) pass karein */}
          <DateRangePicker
            value={dateRange}
            onChange={(val, dates) => {
              setDateRange(val);
              if (dates) setCustomDates(dates);
            }}
          />
        </div>
      </div>

      {metrics && (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 relative z-10">
          <KPICard title="Total Spend" value={formatCurrency(metrics.spend)} icon={Coins} trend="down" trendValue="2.1%" />
          <KPICard title="Total Impressions" value={formatNumber(metrics.impressions)} icon={Users} trend="up" trendValue="12.5%" />
          <KPICard title="Total Clicks" value={formatNumber(metrics.clicks)} icon={MousePointerClick} trend="up" trendValue="8.2%" />
          <KPICard title="Average CTR" value={metrics.ctr} icon={Activity} />
          <KPICard title="Conversions" value={formatNumber(metrics.conversions)} icon={Target} trend="up" trendValue="14.3%" />
          <KPICard title="Estimated ROAS" value={metrics.roas} icon={TrendingUp} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 relative z-10">
        <PerformanceChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 gap-8 relative z-10">
        <CampaignTable data={filteredData} />
      </div>
    </div>
  );
}
