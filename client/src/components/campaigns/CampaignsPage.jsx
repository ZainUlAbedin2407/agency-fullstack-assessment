import React from 'react';
import { Target, Plus } from 'lucide-react';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { useCampaignData } from '@/hooks/useCampaignData';

export function CampaignsPage() {
  const { data, loading } = useCampaignData();

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading campaigns...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-2xl p-6 sm:px-8 border-white/40 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2" />
        
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Media <span className="text-primary">Campaigns</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            Manage, duplicate, or inspect existing campaign parameters.
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 relative z-10 w-full max-w-full">
        <CampaignTable data={data} />
      </div>
    </div>
  );
}
