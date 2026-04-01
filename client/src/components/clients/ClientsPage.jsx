import React from 'react';
import { Users, Building2, Search } from 'lucide-react';

export function ClientsPage() {
  const clientsMock = [
    { id: 'CL-102', name: 'Acme Corp', status: 'Active', campaigns: 3, spend: '$45,000' },
    { id: 'CL-103', name: 'Global Tech', status: 'Onboarding', campaigns: 0, spend: '$0' },
    { id: 'CL-104', name: 'Nova Enterprises', status: 'Active', campaigns: 8, spend: '$120,400' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-2xl p-6 sm:px-8 border-white/40 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2" />
        
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Active <span className="text-primary">Clients</span>
          </h2>
          <p className="text-base text-muted-foreground mt-1.5 font-medium">
            View directory of brand partners and overall agency spend.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border-white/40 dark:border-white/5 pb-2">
        <div className="p-6 border-b border-white/20 dark:border-white/5 flex items-center justify-between bg-card/40 backdrop-blur-md rounded-t-2xl">
          <h3 className="text-xl font-bold">Client Roster</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search clients..." className="pl-9 pr-4 py-2 border border-input rounded-xl bg-background/50 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-[200px]" />
          </div>
        </div>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-muted/30 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Client / Brand</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Active Campaigns</th>
              <th className="px-6 py-4 text-right">YTD Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-card/20">
            {clientsMock.map(client => (
              <tr key={client.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  {client.name}
                </td>
                <td className="px-6 py-4 font-medium text-muted-foreground">{client.id}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">{client.campaigns}</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">{client.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
