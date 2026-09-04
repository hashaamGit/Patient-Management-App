import { LayoutDashboard, Activity, FlaskConical, History, FileText, Settings } from 'lucide-react';

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavigationBar = ({ activeTab, setActiveTab }: NavProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Vitals', icon: LayoutDashboard },
    { id: 'diagnostics', label: 'AI Diagnostics', icon: Activity },
    { id: 'labs', label: 'Lab Reports', icon: FlaskConical },
    { id: 'history', label: 'Patient History', icon: History },
  ];

  return (
    <div className="bg-nav text-white w-full flex items-center justify-between px-6 py-3 shadow-md no-print z-30 relative">
      <div className="flex items-center space-x-8">
        <div className="flex items-center text-primary font-bold text-xl tracking-tight">
          <Activity className="w-6 h-6 mr-2" />
          CLIN/RAIL
        </div>
        
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors">
          <FileText className="w-5 h-5" />
        </button>
        <button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-primary/30">
          HA
        </div>
      </div>
    </div>
  );
};
