import React, { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CampaignsPage } from './components/campaigns/CampaignsPage';
import { ClientsPage } from './components/clients/ClientsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { BriefBuilderPage } from './components/brief/BriefBuilderPage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'brief':
        return <BriefBuilderPage />;
      case 'clients':
        return <ClientsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="font-sans antialiased">
      <Shell activePage={activePage} setActivePage={setActivePage}>
        {renderContent()}
      </Shell>
    </div>
  );
}

export default App;
