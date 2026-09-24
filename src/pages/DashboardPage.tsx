import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Route as RouteIcon,
  LayoutDashboard,
  Compass,
  Truck,
  AlertTriangle,
  Brain,
  LogOut,
  User,
  CheckCircle2,
  Clock,
  MapPin,
  AlertOctagon,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  Database,
  RefreshCw,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import {
  addUserActivity,
  getUserActivities,
  updateUserProgress,
  ActivityItem
} from '../services/firestoreService';

export interface RouteItem {
  id: string;
  from: string;
  to: string;
  status: 'Open' | 'Risk' | 'Blocked';
  reason?: string;
  delayMin: number;
  lengthKm: number;
  lastUpdated: string;
  terrainType: string;
}

export interface VehicleItem {
  id: string;
  cargo: string;
  route: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Scheduled';
  eta: string;
  progress: number;
  driver: string;
}

export interface IncidentItem {
  id: string;
  route: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  timestamp: string;
  reporter: string;
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 400;
    const stepTime = Math.max(Math.floor(duration / (end || 1)), 30);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const DashboardPage: React.FC = () => {
  const {
    user,
    userProfile,
    profileLoading,
    profileError,
    refreshUserProfile,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  // Active Tab & Modal State
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'logistics' | 'incidents' | 'advisor'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [firestoreSynced, setFirestoreSynced] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [isSavingIncident, setIsSavingIncident] = useState(false);

  // Highway Routes Template
  const [routes, setRoutes] = useState<RouteItem[]>([
    {
      id: 'R-101',
      from: 'Guwahati',
      to: 'Shillong',
      status: 'Open',
      reason: 'Normal corridor flow.',
      delayMin: 0,
      lengthKm: 99,
      lastUpdated: 'Just now',
      terrainType: 'Mountainous Highway'
    },
    {
      id: 'R-102',
      from: 'Guwahati',
      to: 'Tawang',
      status: 'Open',
      reason: 'Clear weather conditions across Sela Pass route.',
      delayMin: 0,
      lengthKm: 440,
      lastUpdated: 'Just now',
      terrainType: 'High Altitude Pass'
    },
    {
      id: 'R-103',
      from: 'Imphal',
      to: 'Kohima',
      status: 'Open',
      reason: 'Normal corridor flow.',
      delayMin: 0,
      lengthKm: 138,
      lastUpdated: 'Just now',
      terrainType: 'Steep Valley Pass'
    },
    {
      id: 'R-104',
      from: 'Agartala',
      to: 'Aizawl',
      status: 'Open',
      reason: 'Normal traffic flow along NH-8 corridor.',
      delayMin: 0,
      lengthKm: 345,
      lastUpdated: 'Just now',
      terrainType: 'Rolling Hills'
    },
    {
      id: 'R-105',
      from: 'Dimapur',
      to: 'Kohima',
      status: 'Open',
      reason: 'Normal corridor flow.',
      delayMin: 0,
      lengthKm: 74,
      lastUpdated: 'Just now',
      terrainType: 'Hilly Highway'
    },
    {
      id: 'R-106',
      from: 'Silchar',
      to: 'Agartala',
      status: 'Open',
      reason: 'Corridor clear with regular patrol.',
      delayMin: 0,
      lengthKm: 250,
      lastUpdated: 'Just now',
      terrainType: 'Plains / Low Hills'
    }
  ]);

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);

  // User-specific Incidents State (persisted per user in Firestore)
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);

  // Load user's persistent activities from Firestore
  useEffect(() => {
    async function loadUserFirestoreData() {
      if (!user?.uid) return;
      try {
        const userActivities = await getUserActivities(user.uid);
        if (userActivities && userActivities.length > 0) {
          const formattedActivities: IncidentItem[] = userActivities.map((act) => ({
            id: act.id || `INC-${Math.floor(100 + Math.random() * 900)}`,
            route: act.route,
            type: act.type,
            severity: act.severity,
            description: act.description,
            timestamp: act.timestamp?.seconds
              ? new Date(act.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Recently saved',
            reporter: act.reporter
          }));

          setIncidents(formattedActivities);
          setFirestoreSynced(true);

          // Update route hazard flags based on reported user activities
          formattedActivities.forEach(inc => {
            if (inc.severity === 'High') {
              setRoutes(prev => prev.map(r => {
                if (`${r.from} → ${r.to}` === inc.route) {
                  return { ...r, status: 'Blocked', reason: `${inc.type}: ${inc.description}`, delayMin: 120 };
                }
                return r;
              }));
            } else if (inc.severity === 'Medium') {
              setRoutes(prev => prev.map(r => {
                if (`${r.from} → ${r.to}` === inc.route && r.status !== 'Blocked') {
                  return { ...r, status: 'Risk', reason: `${inc.type}: ${inc.description}`, delayMin: 40 };
                }
                return r;
              }));
            }
          });
        } else {
          setIncidents([]);
          setFirestoreSynced(false);
        }
      } catch (err) {
        console.warn("Notice loading user activities from Firestore:", err);
      }
    }

    loadUserFirestoreData();
  }, [user?.uid]);

  // Incident Form State
  const [incRoute, setIncRoute] = useState('Guwahati → Shillong');
  const [incType, setIncType] = useState('Road Blockage');
  const [incSeverity, setIncSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [incDesc, setIncDesc] = useState('');
  const [incSuccessMsg, setIncSuccessMsg] = useState<string | null>(null);
  const [incErrorMsg, setIncErrorMsg] = useState<string | null>(null);

  // AI Advisor Form State
  const [advFrom, setAdvFrom] = useState('Guwahati');
  const [advTo, setAdvTo] = useState('Shillong');
  const [advisorResult, setAdvisorResult] = useState<any | null>(null);

  // Handlers
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIncSuccessMsg(null);
    setIncErrorMsg(null);

    if (!incDesc.trim()) {
      alert('Please enter a brief description of the incident.');
      return;
    }

    setIsSavingIncident(true);

    const newInc: IncidentItem = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      route: incRoute,
      type: incType,
      severity: incSeverity,
      description: incDesc,
      timestamp: 'Just now',
      reporter: user?.email || 'Logged Dispatcher'
    };

    // 1. Update Local React State
    const updatedIncidents = [newInc, ...incidents];
    setIncidents(updatedIncidents);

    // Update affected route status locally
    let updatedRoutes = [...routes];
    if (incSeverity === 'High') {
      updatedRoutes = routes.map(r => {
        const routeName = `${r.from} → ${r.to}`;
        if (routeName === incRoute) {
          return { ...r, status: 'Blocked', reason: `${incType}: ${incDesc}`, delayMin: Math.max(r.delayMin, 120) };
        }
        return r;
      });
      setRoutes(updatedRoutes);
    } else if (incSeverity === 'Medium') {
      updatedRoutes = routes.map(r => {
        const routeName = `${r.from} → ${r.to}`;
        if (routeName === incRoute && r.status !== 'Blocked') {
          return { ...r, status: 'Risk', reason: `${incType}: ${incDesc}`, delayMin: Math.max(r.delayMin, 40) };
        }
        return r;
      });
      setRoutes(updatedRoutes);
    }

    // 2. Persist directly to Cloud Firestore under users/{user.uid}/activities
    if (user?.uid) {
      try {
        const activityPayload: ActivityItem = {
          route: incRoute,
          type: incType,
          severity: incSeverity,
          description: incDesc,
          reporter: user.email || 'Logged Dispatcher'
        };

        const addedId = await addUserActivity(user.uid, activityPayload);

        // Update user progress stats in Firestore users/{user.uid}
        const newAtRiskCount = updatedRoutes.filter(r => r.status === 'Risk' || r.status === 'Blocked').length;
        await updateUserProgress(user.uid, {
          activeRoutesCount: updatedRoutes.length,
          routesAtRiskCount: newAtRiskCount,
          activeIncidentsCount: updatedIncidents.length,
          vehiclesInTransitCount: vehicles.length
        });

        refreshUserProfile();
        setFirestoreSynced(true);
        if (addedId) {
          setIncSuccessMsg('Incident reported & saved to Cloud Firestore (users/' + user?.uid?.substring(0, 6) + '...)!');
        } else {
          setIncSuccessMsg('Incident reported locally. (Cloud Firestore write restricted by security rules)');
        }
      } catch (err) {
        console.warn("Firestore incident write notice:", err);
        setIncErrorMsg('Incident reported locally. Cloud Firestore permission restricted.');
      }
    }

    setIncDesc('');
    setIsSavingIncident(false);
    setTimeout(() => {
      setIncSuccessMsg(null);
      setIncErrorMsg(null);
    }, 5000);
  };

  const handleAnalyzeRoute = () => {
    const routeName = `${advFrom} → ${advTo}`;
    const matchedRoute = routes.find(r => `${r.from} → ${r.to}` === routeName);

    if (!matchedRoute) {
      setAdvisorResult({
        primaryRoute: routeName,
        status: 'Open',
        riskLevel: 'Low',
        estimatedDelay: '0 min',
        reason: 'Standard highway corridor reported clear with no active hazard flags.',
        recommendation: `Proceed via primary highway corridor ${routeName}. Maintain standard mountain driving precautions.`,
        alternative: 'Standard route optimal'
      });
      return;
    }

    if (matchedRoute.status === 'Blocked') {
      setAdvisorResult({
        primaryRoute: routeName,
        status: 'Blocked',
        riskLevel: 'High',
        estimatedDelay: `${matchedRoute.delayMin} min`,
        reason: matchedRoute.reason || 'Road closure reported on primary corridor.',
        recommendation: `AVOID ${routeName} primary corridor due to active road blockage. Re-route heavy freight via regional feeder bypasses or hold until clearing crews report green status.`,
        alternative: matchedRoute.from === 'Imphal' ? 'Imphal → Jiribam → Silchar bypass' : 'Dawki-Jowai Feeder Connector'
      });
    } else if (matchedRoute.status === 'Risk') {
      setAdvisorResult({
        primaryRoute: routeName,
        status: 'Risk',
        riskLevel: 'Medium',
        estimatedDelay: `${matchedRoute.delayMin} min`,
        reason: matchedRoute.reason || 'Adverse weather or road repair disruption.',
        recommendation: `Primary corridor ${routeName} is accessible with expected delay (+${matchedRoute.delayMin}m). Dispatch vehicles early or consider secondary state roads for perishable cargo.`,
        alternative: matchedRoute.from === 'Guwahati' ? 'Guwahati → Nongpoh → Dawki Bypass' : 'Secondary feeder highway'
      });
    } else {
      setAdvisorResult({
        primaryRoute: routeName,
        status: 'Open',
        riskLevel: 'Low',
        estimatedDelay: '0 min',
        reason: 'Corridor telemetry indicates smooth traffic flow.',
        recommendation: `Primary route ${routeName} is fully operational. Optimal fuel efficiency and minimal transit risk predicted.`,
        alternative: 'Direct highway route optimal'
      });
    }
  };

  // Dynamic KPI counts (sourced from Firestore progress or live state)
  const activeRoutesCount = userProfile?.progress?.activeRoutesCount ?? (incidents.length > 0 ? routes.length : 0);
  const atRiskCount = routes.filter(r => r.status === 'Risk' || r.status === 'Blocked').length;
  const activeIncidentsCount = incidents.length;
  const inTransitCount = userProfile?.progress?.vehiclesInTransitCount ?? vehicles.length;

  const getUserDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Logistics Controller';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-600 text-white rounded-lg shadow-sm">
                  <RouteIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Smart <span className="text-sky-600">NER</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                  Ops Console
                </span>
              </div>
            </div>

            {/* User Greeting & Firestore Status Badge & Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
                <Database className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[200px]">{getUserDisplayName()}</span>
                <span className="text-slate-500 text-[11px] truncate max-w-[120px] sm:max-w-[180px]">({user?.email})</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar Nav (Desktop & Mobile Drawer) */}
        <aside className={`
          fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs p-4 md:p-0 md:static md:bg-transparent md:backdrop-blur-none md:col-span-3 lg:col-span-3 xl:col-span-2 transition-all duration-200
          ${mobileSidebarOpen ? 'block' : 'hidden md:block'}
        `}>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-20 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 md:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation Menu</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('routes'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'routes'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Compass className="w-4.5 h-4.5" />
                <span>Route Accessibility</span>
              </div>
              {atRiskCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  {atRiskCount} Risk
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('logistics'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'logistics'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4.5 h-4.5" />
              <span>Logistics Telemetry</span>
            </button>

            <button
              onClick={() => { setActiveTab('incidents'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'incidents'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4.5 h-4.5" />
                <span>Incident Reporting</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                {activeIncidentsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('advisor'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'advisor'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-4.5 h-4.5" />
              <span>AI Route Advisor</span>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Tab Main Content */}
        <main className="md:col-span-9 lg:col-span-9 xl:col-span-10 space-y-6">

          {/* Firestore Profile Error Alert Banner */}
          {profileError && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900 shadow-sm">
              <div className="flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">Cloud Firestore Profile Access Notice</p>
                  <p className="text-rose-700 mt-0.5 leading-relaxed">{profileError}</p>
                </div>
              </div>
              <button
                onClick={refreshUserProfile}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Profile</span>
              </button>
            </div>
          )}

          {/* Firestore Profile Loading Banner */}
          {profileLoading && !userProfile && !profileError && (
            <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-sky-900 shadow-sm">
              <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
              <span>Loading Cloud Firestore user profile data...</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Greeting Header */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Good morning, {getUserDisplayName()} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      North Eastern Region logistics monitoring & route accessibility control panel.
                    </p>
                  </div>
                  <div className="inline-flex items-center space-x-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Firestore Document: <code className="font-mono text-[11px]">users/{user?.uid?.substring(0, 8)}...</code></span>
                  </div>
                </div>

                {/* Operations Process Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="text-xs uppercase font-bold text-slate-400">Workflow:</span>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded">1. Monitor Routes</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">2. Identify Hazard</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded">3. Assess Risk</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded">4. AI Advisory</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">5. Take Action</span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Routes */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Routes</span>
                    <Compass className="w-4.5 h-4.5 text-sky-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900"><AnimatedCounter value={activeRoutesCount} /></div>
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Monitored NER corridors</span>
                  </div>
                </div>

                {/* Routes at Risk */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Routes at Risk</span>
                    <AlertOctagon className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600"><AnimatedCounter value={atRiskCount} /></div>
                  <div className="text-xs text-amber-700 font-medium">
                    Weather / road work alert
                  </div>
                </div>

                {/* Active Incidents */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Incidents</span>
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-rose-600"><AnimatedCounter value={activeIncidentsCount} /></div>
                  <div className="text-xs text-rose-700 font-medium">
                    {firestoreSynced ? 'Synced with Firestore' : 'Reported incidents'}
                  </div>
                </div>

                {/* Vehicles in Transit */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Vehicles in Transit</span>
                    <Truck className="w-4.5 h-4.5 text-sky-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-sky-800"><AnimatedCounter value={inTransitCount} /></div>
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Active supply dispatches</span>
                  </div>
                </div>
              </div>

              {/* Quick Overview Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Corridor Status List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
                      <Compass className="w-4.5 h-4.5 text-sky-600" />
                      <span>Key Highway Corridor Status</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('routes')}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {routes.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRoute(r)}
                        className="bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center space-x-1">
                            <span>{r.from} → {r.to}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5" />
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{r.terrainType} • {r.lengthKm} km</div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            r.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            r.status === 'Risk' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {r.status === 'Open' ? '🟢 OPEN' : r.status === 'Risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                          </span>
                          {r.delayMin > 0 && (
                            <div className="text-[10px] text-rose-700 font-medium mt-1">+{r.delayMin} min delay</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Incident Feed */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>User Activity Feed ({incidents.length})</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('incidents')}
                      className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center space-x-1"
                    >
                      <span>Report New</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {incidents.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl space-y-2">
                      <p className="font-semibold text-slate-700">No disruptions reported yet for this account.</p>
                      <button
                        onClick={() => setActiveTab('incidents')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Report a Disruption</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {incidents.slice(0, 3).map((inc) => (
                        <div key={inc.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{inc.route}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              inc.severity === 'High' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              inc.severity === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              'bg-sky-50 text-sky-800 border-sky-200'
                            }`}>
                              {inc.severity} Severity
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal">{inc.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span>Type: {inc.type}</span>
                            <span>{inc.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ROUTE ACCESSIBILITY */}
          {/* ========================================================================= */}
          {activeTab === 'routes' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Route Accessibility Intelligence</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Stylized North Eastern Region corridor network status. Real-time road availability and mountain pass alerts.
                </p>
              </div>

              {/* Stylized Light NER SVG Network Visualizer */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>NER Key Corridor Topology Map</span>
                </h2>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col items-center justify-center">
                  <svg viewBox="0 0 700 320" className="w-full h-auto max-h-[320px]">
                    <pattern id="lightGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    </pattern>
                    <rect width="700" height="320" fill="url(#lightGrid)" />

                    <line x1="180" y1="120" x2="260" y2="190" stroke="#0284c7" strokeWidth="2.5" />
                    <line x1="180" y1="120" x2="140" y2="40" stroke="#10b981" strokeWidth="3" />
                    <line x1="480" y1="210" x2="450" y2="130" stroke="#0284c7" strokeWidth="2.5" />
                    <line x1="280" y1="260" x2="420" y2="270" stroke="#10b981" strokeWidth="3" />
                    <line x1="180" y1="120" x2="330" y2="210" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
                    <line x1="330" y1="210" x2="280" y2="260" stroke="#10b981" strokeWidth="2.5" />

                    <g transform="translate(180, 120)">
                      <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="14" y="4" fill="#0f172a" fontSize="12" fontWeight="bold">Guwahati (Hub)</text>
                    </g>
                    <g transform="translate(140, 40)">
                      <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="-50" y="-10" fill="#065f46" fontSize="11" fontWeight="bold">Tawang (🟢 Open)</text>
                    </g>
                    <g transform="translate(260, 190)">
                      <circle r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="12" y="15" fill="#0f172a" fontSize="11" fontWeight="bold">Shillong</text>
                    </g>
                    <g transform="translate(480, 210)">
                      <circle r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="12" y="15" fill="#0f172a" fontSize="11" fontWeight="bold">Imphal</text>
                    </g>
                    <g transform="translate(450, 130)">
                      <circle r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <text x="12" y="-5" fill="#0f172a" fontSize="11" fontWeight="bold">Kohima</text>
                    </g>
                    <g transform="translate(280, 260)">
                      <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="-60" y="18" fill="#065f46" fontSize="11" fontWeight="bold">Agartala</text>
                    </g>
                    <g transform="translate(420, 270)">
                      <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="12" y="4" fill="#065f46" fontSize="11" fontWeight="bold">Aizawl</text>
                    </g>
                  </svg>

                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs mt-4 pt-4 border-t border-slate-200 w-full">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-700 font-medium">🟢 OPEN = Normal Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-slate-700 font-medium">🟡 AT RISK = Delay / Caution</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                      <span className="text-slate-700 font-medium">🔴 BLOCKED = Road Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Status Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-sky-600" />
                          <span className="font-bold text-slate-900 text-base">{route.from} → {route.to}</span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          route.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          route.status === 'Risk' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {route.status === 'Open' ? '🟢 OPEN' : route.status === 'Risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Terrain Type:</span>
                          <span className="font-medium text-slate-800">{route.terrainType}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Corridor Distance:</span>
                          <span className="font-medium text-slate-800">{route.lengthKm} km</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Estimated Delay:</span>
                          <span className={`font-semibold ${route.delayMin > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {route.delayMin > 0 ? `+${route.delayMin} mins` : 'On Schedule'}
                          </span>
                        </div>
                      </div>

                      {route.reason && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <span className="text-slate-500 font-semibold block mb-0.5">Disruption Reason:</span>
                          <span className="text-slate-800">{route.reason}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Corridor Ref: {route.id}</span>
                      <span>Updated: {route.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: LOGISTICS / VEHICLE MONITORING */}
          {/* ========================================================================= */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Logistics Fleet Telemetry</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Active freight dispatch updates, cargo categories, progress bars, and ETA projections.
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-medium self-start sm:self-auto">
                  Active Dispatches: <strong className="text-slate-900">{vehicles.length}</strong>
                </span>
              </div>

              {/* Vehicle Monitoring List */}
              {vehicles.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                  <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No Active Vehicles in Dispatch</p>
                  <p className="text-[11px] text-slate-400 mt-1">Vehicle dispatches assigned to your UID will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map((v) => (
                    <div key={v.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-xl">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 text-base">{v.id}</span>
                              <span className="text-xs text-slate-500">({v.driver})</span>
                            </div>
                            <div className="text-xs text-slate-600 font-medium">{v.cargo}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            v.status === 'In Transit' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                            v.status === 'Delayed' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                            v.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {v.status}
                          </span>
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-semibold text-slate-400">ETA</div>
                            <div className="text-xs font-bold text-slate-900">{v.eta}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                          <span>Route: {v.route}</span>
                          <span>{v.progress}% completed</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              v.status === 'Delayed' ? 'bg-rose-500' :
                              v.status === 'Delivered' ? 'bg-emerald-500' :
                              'bg-sky-600'
                            }`}
                            style={{ width: `${v.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INCIDENT REPORTING */}
          {/* ========================================================================= */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Incident Reporting System</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Report road blockages or weather hazards. Submissions immediately update active incident metrics and persist in Firestore under <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono">users/{user?.uid?.substring(0, 6)}.../activities</code>.
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-1.5 text-xs text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl font-medium">
                  <Database className="w-3.5 h-3.5 text-sky-600" />
                  <span>Firestore Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 pb-3 border-b border-slate-100">
                    <PlusCircle className="w-4 h-4 text-sky-600" />
                    <span>Report New Incident</span>
                  </h2>

                  {incSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{incSuccessMsg}</span>
                    </div>
                  )}

                  {incErrorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{incErrorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleReportIncident} className="space-y-4">
                    {/* Route */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Route Corridor
                      </label>
                      <select
                        value={incRoute}
                        onChange={(e) => setIncRoute(e.target.value)}
                        className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                      >
                        {routes.map(r => (
                          <option key={r.id} value={`${r.from} → ${r.to}`}>
                            {r.from} → {r.to} ({r.terrainType})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Incident Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Incident Type
                      </label>
                      <select
                        value={incType}
                        onChange={(e) => setIncType(e.target.value)}
                        className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                      >
                        <option value="Road Blockage">Road Blockage</option>
                        <option value="Landslide">Landslide</option>
                        <option value="Flooding">Flooding</option>
                        <option value="Accident">Accident</option>
                        <option value="Road Damage">Road Damage</option>
                      </select>
                    </div>

                    {/* Severity */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Severity Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Low', 'Medium', 'High'] as const).map((sev) => (
                          <button
                            type="button"
                            key={sev}
                            onClick={() => setIncSeverity(sev)}
                            className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                              incSeverity === sev
                                ? sev === 'High' ? 'bg-rose-600 text-white border-rose-600' :
                                  sev === 'Medium' ? 'bg-amber-600 text-white border-amber-600' :
                                  'bg-sky-600 text-white border-sky-600'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={incDesc}
                        onChange={(e) => setIncDesc(e.target.value)}
                        placeholder="Provide location details, landmark, or blockage scope..."
                        className="block w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingIncident}
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSavingIncident ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to Cloud Firestore...</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Report Incident & Save to Firestore</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Log Stream (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <AlertOctagon className="w-4 h-4 text-amber-600" />
                      <span>User Activity Feed ({incidents.length})</span>
                    </h2>
                    <span className="text-[10px] text-slate-500 font-mono">Owner UID: {user?.uid?.substring(0, 10)}...</span>
                  </div>

                  {incidents.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No Incidents Reported Yet</p>
                      <p className="text-[11px] text-slate-400 mt-1">Submit your first road hazard report on the left form to persist data in Firestore.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {incidents.map((inc) => (
                        <div key={inc.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{inc.route}</span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                              inc.severity === 'High' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              inc.severity === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              'bg-sky-50 text-sky-800 border-sky-200'
                            }`}>
                              {inc.severity} Severity
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{inc.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                            <span>Type: <strong className="text-slate-700">{inc.type}</strong></span>
                            <span>Reporter: {inc.reporter}</span>
                            <span>{inc.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: AI ROUTE ADVISOR */}
          {/* ========================================================================= */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-sky-600" />
                  <h1 className="text-xl font-bold text-slate-900">AI-Assisted Route Recommendation</h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Transparent rule-based recommendation engine evaluating active road hazards, weather risks, and delays to suggest safe corridors.
                </p>
              </div>

              {/* Selector */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
                <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Target Freight Corridor Rerouting Analysis
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Origin City (From)
                    </label>
                    <select
                      value={advFrom}
                      onChange={(e) => setAdvFrom(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                    >
                      <option value="Guwahati">Guwahati</option>
                      <option value="Imphal">Imphal</option>
                      <option value="Agartala">Agartala</option>
                      <option value="Dimapur">Dimapur</option>
                      <option value="Silchar">Silchar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Destination City (To)
                    </label>
                    <select
                      value={advTo}
                      onChange={(e) => setAdvTo(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                    >
                      <option value="Shillong">Shillong</option>
                      <option value="Tawang">Tawang</option>
                      <option value="Kohima">Kohima</option>
                      <option value="Aizawl">Aizawl</option>
                      <option value="Agartala">Agartala</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeRoute}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Route</span>
                </button>
              </div>

              {/* Recommendation Display */}
              {advisorResult && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">AI Recommendation Result</span>
                      <h3 className="text-lg font-bold text-slate-900">{advisorResult.primaryRoute}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        advisorResult.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        advisorResult.status === 'Risk' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        Status: {advisorResult.status === 'Open' ? '🟢 OPEN' : advisorResult.status === 'Risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Risk Level: <strong className={advisorResult.riskLevel === 'High' ? 'text-rose-600' : advisorResult.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}>{advisorResult.riskLevel}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-semibold block">Disruption Factor / Cause:</span>
                      <p className="text-slate-800">{advisorResult.reason}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-semibold block">Recommended Alternative Corridor:</span>
                      <p className="text-sky-700 font-bold">{advisorResult.alternative}</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center space-x-2 text-sky-900 font-bold">
                      <Brain className="w-4 h-4 text-sky-600" />
                      <span>Actionable AI Operational Guidance:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-6">
                      {advisorResult.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Interactive Route Details Modal Overlay */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Corridor Telemetry Detail</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedRoute.from} → {selectedRoute.to}</h3>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500">Current Status:</span>
                <span className={`px-3 py-1 font-bold text-xs rounded-full border ${
                  selectedRoute.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  selectedRoute.status === 'Risk' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {selectedRoute.status === 'Open' ? '🟢 OPEN' : selectedRoute.status === 'Risk' ? '🟡 AT RISK' : '🔴 BLOCKED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Terrain Type</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedRoute.terrainType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Corridor Distance</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedRoute.lengthKm} km</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Active Disruption / Reason</span>
                <span className="text-slate-800 font-medium">{selectedRoute.reason || 'Normal corridor flow.'}</span>
              </div>

              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Recommended Dispatch Action:</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {selectedRoute.status === 'Blocked'
                    ? 'AVOID primary highway corridor. Re-route heavy freight via regional bypass feeders.'
                    : selectedRoute.status === 'Risk'
                    ? 'Dispatch vehicles with buffer time (+40 min). Monitor mountain weather pass telemetry.'
                    : 'Optimal corridor status. Direct transit greenlit for heavy freight and supply dispatches.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIncRoute(`${selectedRoute.from} → ${selectedRoute.to}`);
                  setSelectedRoute(null);
                  setActiveTab('incidents');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Incident</span>
              </button>
              <button
                onClick={() => {
                  setAdvFrom(selectedRoute.from);
                  setAdvTo(selectedRoute.to);
                  setSelectedRoute(null);
                  setActiveTab('advisor');
                  handleAnalyzeRoute();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with AI Advisor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
