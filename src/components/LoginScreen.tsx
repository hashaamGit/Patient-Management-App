import { useAppStore } from '../store/useAppStore';
import { User, Stethoscope, Pill, Shield, Activity } from 'lucide-react';

const ROLES = [
  { name: 'Dr. Hassan Aqeel', role: 'Doctor', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Nurse Sarah', role: 'Nurse', icon: User, color: 'text-green-500', bg: 'bg-green-500/10' },
  { name: 'Pharm. Ahmed', role: 'Pharmacist', icon: Pill, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'System Admin', role: 'Admin', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
];

export const LoginScreen = () => {
  const login = useAppStore((state) => state.login);

  return (
    <div className="min-h-screen w-full bg-canvas flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Activity className="w-10 h-10 text-primary-light heartbeat" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full pulse-dot" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-wide">
              CLIN<span className="text-primary-light">/</span>RAIL
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-text">Welcome Back</h2>
          <p className="text-text-muted">Select your role to access the clinical workspace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map(({ name, role, icon: Icon, color, bg }) => (
            <button
              key={role}
              onClick={() => login(name, role as any)}
              className="group flex flex-col items-center p-6 bg-surface border border-border rounded-xl hover:border-primary-light transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">{name}</h3>
              <span className="text-sm text-text-muted">{role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
