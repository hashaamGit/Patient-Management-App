import React from 'react';
import {
  Activity, Stethoscope, ShieldCheck, Pill, ArrowRight,
  ClipboardList, Database, Clock, Users,
  HeartPulse, Sparkles, Building2, ChevronRight, Lock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface HomePageProps {
  onOpenLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-teal-500 selection:text-white flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Hassan and Co.
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  CLINICAL OS
                </span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Enterprise Healthcare Systems</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">Clinical Modules</a>
            <a href="#roles" className="hover:text-teal-400 transition-colors">Role Consoles</a>
            <a href="#about" className="hover:text-teal-400 transition-colors">About Us</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold shadow-md shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Lock className="w-4 h-4" />
              <span>Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-teal-600/20 to-emerald-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-teal-300 font-medium shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Hassan and Co. Healthcare Systems • Certified Clinical Software V5.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Precision Healthcare Management <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Engineered for Modern Clinicians
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            A comprehensive, high-velocity clinical workstation combining 1,500+ diagnostic decision trees, 
            instant pediatric & allergy-safe prescribing, live pharmacy dispensing, and institutional store inventory.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-5 h-5 text-slate-950" />
              <span>Launch Clinical Workspace</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-colors"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">1,600+</div>
              <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Clinical Symptoms</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1,600+</div>
              <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Disease Protocols</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">5 Roles</div>
              <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Integrated RBAC</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">0.0 ms</div>
              <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Zero-Cloud Latency</div>
            </div>
          </div>

        </div>
      </section>

      {/* Modules Feature Grid */}
      <section id="features" className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Enterprise Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Every Step of Patient Care
            </h3>
            <p className="text-slate-400 text-base">
              Hassan and Co. eliminates healthcare software fragmentation by delivering dedicated, synchronized workflows across all hospital departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1: Diagnostic Engine */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Stepwise Diagnostic Engine</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Interactive branching logic across 1,600+ symptoms and diseases. Dynamically cross-references pediatric ages and warns against drug allergies.
              </p>
              <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                Full Decision Trees & Protocols <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Module 2: Precision Prescription Pad */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Precision Hospital Rx Pad</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Hospital-grade printable prescription template with registration letterhead, drug interaction safety checks, and flawless A4 PDF export.
              </p>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Zero Blank Page Guaranteed <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Module 3: Pharmacy Dispensary */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Pharmacy Dispensing Queue</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Real-time queue for hospital pharmacists to verify physician prescriptions, double-check allergy alerts, and dispense with live inventory sync.
              </p>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                Integrated Dispensing Safety <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Module 4: Medical Store & Inventory */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Storekeeper Inventory Suite</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Institutional stock management with minimum threshold alerts, batch expiry tracking, and instant stock adjustments for consumables.
              </p>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                Live Stock & Expiry Control <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Module 5: Vitals & Nursing Triage */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all hover:shadow-xl hover:shadow-rose-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Nursing & Vitals Triage</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Fast-entry vital intake in standard Celsius (°C), Blood Pressure charting, SpO2 pulse oximetry, and automated SOAP Note compilation.
              </p>
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                Metric Standardized Intake <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Module 6: Institutional Admin */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Administrator Governance</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                High-privilege console to register and delete doctors, audit hospital activity logs, and securely manage system data persistence.
              </p>
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                Full Staff & System Control <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Role Consoles Overview */}
      <section id="roles" className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Multi-User Workspaces</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              One Unified System, 5 Tailored Experiences
            </h3>
            <p className="text-slate-400 text-sm">
              Logging into Hassan and Co. adapts the entire user interface to the clinician's exact job requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 text-center hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base">Doctor</h5>
              <p className="text-xs text-slate-400 mt-1">Diagnosis, Rx Pad, SOAP Notes, Clinical Insights</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 text-center hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base">Nurse</h5>
              <p className="text-xs text-slate-400 mt-1">Vitals intake, nursing task orders, triage</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 text-center hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Pill className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base">Pharmacist</h5>
              <p className="text-xs text-slate-400 mt-1">Fulfillment queue, drug interaction checks</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 text-center hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base">Storekeeper</h5>
              <p className="text-xs text-slate-400 mt-1">Stock batches, expiry alerts, inventory control</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/80 text-center hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base">Admin</h5>
              <p className="text-xs text-slate-400 mt-1">Doctor registry, user deletion, system data purge</p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <span>Access Your Role Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="mt-auto bg-slate-950 border-t border-slate-800/80 py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-slate-200">Hassan and Co. Healthcare Systems</span>
            <span>• Medical Workstation V5.0</span>
          </div>
          <div>
            Built with clinical integrity for hospitals, clinics, and academic medical centers.
          </div>
        </div>
      </footer>

    </div>
  );
};
