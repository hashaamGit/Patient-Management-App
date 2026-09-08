import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { UserRole } from '../store/useAppStore';
import {
  User, Stethoscope, Pill, Shield, Activity,
  Building2, ArrowLeft, Lock, KeyRound, CheckCircle2
} from 'lucide-react';

interface LoginScreenProps {
  onBackToHome?: () => void;
}

interface RoleConfig {
  name: string;
  role: UserRole;
  designation: string;
  icon: any;
  color: string;
  bg: string;
  badge: string;
  defaultPin: string;
}

const ROLES: RoleConfig[] = [
  {
    name: 'Dr. Hassan Aqeel',
    role: 'Doctor',
    designation: 'Consultant Physician & Internist',
    icon: Stethoscope,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badge: 'Medical Staff',
    defaultPin: '1234'
  },
  {
    name: 'Nurse Sarah',
    role: 'Nurse',
    designation: 'Senior Triage & Charge Nurse',
    icon: User,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    badge: 'Nursing Unit',
    defaultPin: '1234'
  },
  {
    name: 'Pharm. Ahmed',
    role: 'Pharmacist',
    designation: 'Head Clinical Pharmacist',
    icon: Pill,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    badge: 'Dispensary',
    defaultPin: '1234'
  },
  {
    name: 'Zahid Khan',
    role: 'Storekeeper',
    designation: 'Medical Store & Logistics Lead',
    icon: Building2,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    badge: 'Central Supply',
    defaultPin: '1234'
  },
  {
    name: 'System Admin',
    role: 'Admin',
    designation: 'Enterprise Hospital Superuser',
    icon: Shield,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    badge: 'High Privilege',
    defaultPin: '9999'
  },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToHome }) => {
  const login = useAppStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleQuickLogin = (roleConfig: RoleConfig) => {
    login(roleConfig.name, roleConfig.role);
  };

  const handleAuthenticatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (pin === selectedRole.defaultPin || pin === '1234' || pin === '9999' || pin === '') {
      login(selectedRole.name, selectedRole.role);
    } else {
      setError(`Invalid PIN code. (Default PIN: ${selectedRole.defaultPin})`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top back button */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>
      )}

      <div className="max-w-5xl w-full space-y-8 z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/20">
              <Activity className="w-7 h-7 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Hassan and Co.
              </h1>
              <p className="text-xs text-teal-400 font-semibold tracking-widest uppercase">Healthcare Management System</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-200">Clinical Authentication Portal</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Select your authorized role profile below to unlock departmental workflows.
          </p>
        </div>

        {/* 5-Role Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROLES.map((roleConfig) => {
            const Icon = roleConfig.icon;
            const isSelected = selectedRole?.role === roleConfig.role;
            return (
              <div
                key={roleConfig.role}
                onClick={() => {
                  setSelectedRole(roleConfig);
                  setPin('');
                  setError('');
                }}
                className={`cursor-pointer group relative flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10 -translate-y-1'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-0.5'
                }`}
              >
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isSelected ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {roleConfig.badge}
                  </span>
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mt-2 mb-4 ${roleConfig.bg} ${roleConfig.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{roleConfig.name}</h3>
                <div className="text-xs font-semibold text-teal-400 mb-2">{roleConfig.role}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {roleConfig.designation}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLogin(roleConfig);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-950 border border-teal-500/30 text-xs font-bold transition-all"
                >
                  Quick Sign In →
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Profile PIN Entry (Optional Security Verification) */}
        {selectedRole && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-teal-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedRole.bg} ${selectedRole.color}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedRole.name}</h4>
                  <p className="text-xs text-slate-400">{selectedRole.role} Access • PIN: {selectedRole.defaultPin}</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Protected</span>
            </div>

            <form onSubmit={handleAuthenticatedLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                  <span>Enter Security PIN or press Enter to Login</span>
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder={`Default: ${selectedRole.defaultPin}`}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
                {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md shadow-teal-500/20 transition-colors"
                >
                  Confirm & Enter Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
