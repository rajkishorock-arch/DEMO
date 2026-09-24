import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CookieConsent } from '../components/CookieConsent';
import { LegalModal, LegalDocType } from '../components/LegalModal';
import { SectionHeading } from '../components/SectionHeading';
import { CapabilityCard, CapabilityItem } from '../components/CapabilityCard';
import { ProcessSteps, ProcessStepItem } from '../components/ProcessSteps';
import { CTASection } from '../components/CTASection';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Truck,
  AlertTriangle,
  Brain,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Mountain,
  Layers,
  Activity,
  AlertOctagon,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Legal modal state
  const [legalDocType, setLegalDocType] = useState<LegalDocType>(null);

  // Live Corridor Simulator State (Input -> Processing -> Result)
  const [simOrigin, setSimOrigin] = useState('Guwahati');
  const [simDestination, setSimDestination] = useState('Shillong');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    status: 'Open' | 'Risk' | 'Blocked';
    corridor: string;
    hazard: string;
    delay: string;
    recommendation: string;
    alternative: string;
  } | null>({
    status: 'Open',
    corridor: 'NH-6 (Guwahati - Shillong Corridor)',
    hazard: 'Optimal road clearance. Mild fog near Umling.',
    delay: '+0 min',
    recommendation: 'Standard transit corridor approved. Maintain standard speed guidelines.',
    alternative: 'None required (Primary corridor clear)'
  });

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    setTimeout(() => {
      if (simOrigin === 'Dimapur' || simDestination === 'Kohima') {
        setSimulationResult({
          status: 'Risk',
          corridor: 'NH-29 (Dimapur - Kohima Bypass)',
          hazard: 'Seasonal rain slurry & heavy freight congestion near Pagla Pahar.',
          delay: '+95 min',
          recommendation: 'Caution advised. Heavy vehicles should utilize the 4-lane bypass or stagger departure by 2 hours.',
          alternative: 'Niuland - Kohima Mountain Feeder'
        });
      } else if (simOrigin === 'Silchar' || simDestination === 'Aizawl') {
        setSimulationResult({
          status: 'Risk',
          corridor: 'NH-306 (Silchar - Aizawl Arterial)',
          hazard: 'Active road widening work and minor mudslip near Vairengte.',
          delay: '+60 min',
          recommendation: 'Single-lane alternate movement in effect. Prioritize morning departures.',
          alternative: 'Hailakandi - Kolasib Route'
        });
      } else {
        setSimulationResult({
          status: 'Open',
          corridor: `${simOrigin} → ${simDestination} Regional Expressway`,
          hazard: 'Dry asphalt, unrestricted clearance across major junctions.',
          delay: '+5 min',
          recommendation: 'Corridor fully accessible. Normal dispatch schedule recommended.',
          alternative: 'Direct State Highway bypass available if needed'
        });
      }
      setIsSimulating(false);
    }, 450);
  };

  // Capabilities Data
  const capabilities: CapabilityItem[] = [
    {
      id: 'accessibility',
      icon: Compass,
      title: 'Route Accessibility',
      badge: 'Real-Time Health',
      badgeVariant: 'open',
      whatItDoes: 'Continuous accessibility telemetry across high-altitude and arterial corridors in the 8 North East states.',
      whyItMatters: 'Eliminates unexpected freight stranded times caused by seasonal monsoon blockages and landslides.',
      actionText: 'View Corridors',
      actionHref: user ? '/dashboard' : '/login'
    },
    {
      id: 'telemetry',
      icon: Truck,
      title: 'Logistics Fleet Telemetry',
      badge: 'Freight Monitoring',
      badgeVariant: 'info',
      whatItDoes: 'Tracks active freight dispatches, cargo categories, journey percentages, and terrain ETA adjustments.',
      whyItMatters: 'Provides dispatch supervisors with accurate, hill-adjusted transit timelines rather than generic GPS estimates.',
      actionText: 'Track Vehicles',
      actionHref: user ? '/dashboard' : '/login'
    },
    {
      id: 'incident',
      icon: AlertTriangle,
      title: 'Incident Intelligence',
      badge: 'Hazard Reporting',
      badgeVariant: 'risk',
      whatItDoes: 'Field-level reporting for mudslides, rockfalls, flooded bypasses, and structural bridge repairs.',
      whyItMatters: 'Feeds crowd-verified hazard data directly into the risk engine and persists history securely in Cloud Firestore.',
      actionText: 'Report Incident',
      actionHref: user ? '/dashboard' : '/login'
    },
    {
      id: 'advisor',
      icon: Brain,
      title: 'Rule-Based Route Advisor',
      badge: 'Deterministic AI',
      badgeVariant: 'neutral',
      whatItDoes: 'Evaluates active road conditions and terrain constraints to deliver deterministic rerouting guidance.',
      whyItMatters: 'Offers auditable, transparent alternative corridors without black-box hallucination risks.',
      actionText: 'Analyze Route',
      actionHref: user ? '/dashboard' : '/login'
    }
  ];

  // How It Works Steps
  const workflowSteps: ProcessStepItem[] = [
    {
      number: '01',
      phaseTag: 'Input',
      title: 'Monitor Corridors',
      description: 'Continuous monitoring of NH-6, NH-27, NH-29, and regional mountain links across all 8 states.',
      icon: Compass
    },
    {
      number: '02',
      phaseTag: 'Detection',
      title: 'Identify Hazards',
      description: 'Field operators and logistics drivers submit geo-tagged disruption reports with severity grading.',
      icon: AlertTriangle
    },
    {
      number: '03',
      phaseTag: 'Analysis',
      title: 'Assess Risk',
      description: 'Automated evaluation calculates impact severity (Low, Medium, High) and projected delay minutes.',
      icon: AlertOctagon
    },
    {
      number: '04',
      phaseTag: 'Advisory',
      title: 'Rule Guidance',
      description: 'The recommendation engine identifies safe bypasses and terrain-viable alternate corridors.',
      icon: Brain
    },
    {
      number: '05',
      phaseTag: 'Action',
      title: 'Dispatch Fleet',
      description: 'Logistics supervisors reroute vehicles in transit before drivers reach compromised mountain passes.',
      icon: Truck
    },
    {
      number: '06',
      phaseTag: 'Persistence',
      title: 'Persist History',
      description: 'All incident actions, status updates, and user telemetry are written securely to Cloud Firestore.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border-b border-slate-200">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sky-950 font-black">Smart NER</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-semibold">Logistics & Route Intelligence OS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Smarter Route Intelligence for the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">
                  North Eastern Region
                </span>
              </h1>

              {/* Supporting Statement */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Overcoming complex Himalayan terrain, monsoon landslides, and corridor chokepoints. Real-time corridor accessibility, crowd-sourced hazard telemetry, and rule-based dispatch intelligence engineered for the 8 North East states.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm group"
                  >
                    <span>Open Operations Console</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm group"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                      href="#capabilities"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl shadow-xs transition-all text-sm"
                    >
                      <span>Explore Capabilities</span>
                    </a>
                  </>
                )}
              </div>

              {/* Operational Proof Chips */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>8 NE States Monitored</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Deterministic Safety Rules</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cloud Firestore Sync</span>
                </div>
              </div>
            </div>

            {/* Right Content / Live Operational Telemetry Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Corridor Telemetry
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Active Feed
                  </span>
                </div>

                {/* Corridor Snippets */}
                <div className="space-y-3 text-xs">
                  {/* Item 1 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">NH-6: Guwahati ↔ Shillong</span>
                      <StatusBadge label="OPEN" variant="open" size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>98 km | Hilly terrain</span>
                      <span className="font-semibold text-emerald-600">+0 min delay</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">NH-29: Dimapur ↔ Kohima</span>
                      <StatusBadge label="AT RISK" variant="risk" size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>74 km | Mud slurry near Pagla Pahar</span>
                      <span className="font-semibold text-amber-600">+95 min delay</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">NH-37: Guwahati ↔ Silchar</span>
                      <StatusBadge label="OPEN" variant="open" size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>310 km | Meghalaya Ridge Highway</span>
                      <span className="font-semibold text-emerald-600">+10 min delay</span>
                    </div>
                  </div>
                </div>

                {/* Rule-Based Guidance Footnote */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Rule Engine: <strong>Active</strong></span>
                  </span>
                  <Link
                    to={user ? '/dashboard' : '/login'}
                    className="text-sky-600 hover:text-sky-700 font-bold inline-flex items-center space-x-1"
                  >
                    <span>Open Dashboard</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VALUE PROPOSITION: WHAT THE PLATFORM DOES */}
      {/* ========================================================================= */}
      <section id="platform" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The Regional Challenge"
            title="Engineered Specifically for North Eastern Terrain"
            description="The 8 states of North East India present unique logistical challenges: monsoonal flash floods, high-altitude passes, seismic instability, and single-corridor vulnerabilities. Smart NER transforms fragmented field updates into unified dispatch intelligence."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mountainous Corridors</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Standard navigation apps fail to capture sudden mudslides or rockfalls along mountain passes. Smart NER delivers instant crowd-sourced and verified alerts.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Deterministic Rerouting</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Transparent rule-based recommendations ensure freight dispatchers receive auditable alternative routes rather than unpredictable automated guesses.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cloud Persistence</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Role-scoped Cloud Firestore architecture isolates individual dispatcher activity, logging all submitted incidents and fleet actions with encrypted security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CAPABILITIES SECTION */}
      {/* ========================================================================= */}
      <section id="capabilities" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Core Platform Capabilities"
            title="Four Pillars of Freight & Corridor Intelligence"
            description="Explore the interconnected modules designed to monitor routes, ingest hazard telemetry, assess delay risk, and dispatch alternative corridors."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap) => (
              <CapabilityCard key={cap.id} item={cap} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (WORKFLOW) */}
      {/* ========================================================================= */}
      <section id="workflow" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Operational Process"
            title="How Smart NER Works in 6 Clear Stages"
            description="From real-time road monitoring through hazard triage to fleet rerouting and persistent cloud logging."
          />

          <div className="mt-12">
            <ProcessSteps steps={workflowSteps} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE PRODUCT EXPERIENCE: LIVE CORRIDOR SIMULATOR */}
      {/* ========================================================================= */}
      <section id="simulator" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Interactive Demonstration"
            title="Simulate Route Risk & Rule-Based Guidance"
            description="Test how the Smart NER intelligence engine evaluates origin-destination corridors across the region in real-time."
          />

          <div className="mt-10 max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <form onSubmit={handleRunSimulation} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Origin City
                </label>
                <select
                  value={simOrigin}
                  onChange={(e) => setSimOrigin(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                >
                  <option value="Guwahati">Guwahati (Assam)</option>
                  <option value="Dimapur">Dimapur (Nagaland)</option>
                  <option value="Silchar">Silchar (Assam)</option>
                  <option value="Agartala">Agartala (Tripura)</option>
                  <option value="Imphal">Imphal (Manipur)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Destination City
                </label>
                <select
                  value={simDestination}
                  onChange={(e) => setSimDestination(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                >
                  <option value="Shillong">Shillong (Meghalaya)</option>
                  <option value="Kohima">Kohima (Nagaland)</option>
                  <option value="Aizawl">Aizawl (Mizoram)</option>
                  <option value="Tawang">Tawang (Arunachal)</option>
                  <option value="Gangtok">Gangtok (Sikkim)</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating Corridors...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run Rule Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Simulation Result Box */}
            {simulationResult && (
              <div className="pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Evaluated Route Corridor
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{simulationResult.corridor}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge
                      label={simulationResult.status}
                      variant={simulationResult.status === 'Open' ? 'open' : simulationResult.status === 'Risk' ? 'risk' : 'blocked'}
                      size="md"
                    />
                    <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      Delay: {simulationResult.delay}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Hazard & Surface Status
                    </span>
                    <p className="text-slate-600">{simulationResult.hazard}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Recommended Alternate Corridor
                    </span>
                    <p className="text-sky-700 font-semibold">{simulationResult.alternative}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-sky-900 font-bold">
                    <Brain className="w-3.5 h-3.5 text-sky-600" />
                    <span>Rule-Based Advisory Guidance</span>
                  </div>
                  <p className="text-slate-700 pl-5 leading-relaxed">{simulationResult.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REGIONAL IMPACT & SYSTEM METRICS */}
      {/* ========================================================================= */}
      <section id="impact" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Measurable Operational Value"
            title="Delivering Reliable Connectivity Across North East India"
            description="Designed for logistics dispatchers, transport contractors, regional suppliers, and highway monitoring authorities."
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-sky-600">8</div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">States Covered</div>
              <div className="text-[11px] text-slate-500">Comprehensive regional corridor tracking</div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Deterministic Logic</div>
              <div className="text-[11px] text-slate-500">Transparent, auditable safety rules</div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">&lt; 300ms</div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Reroute Latency</div>
              <div className="text-[11px] text-slate-500">Instant client-side corridor evaluation</div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">TLS 1.3</div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Cloud Encryption</div>
              <div className="text-[11px] text-slate-500">Role-scoped Cloud Firestore persistence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH CONVERSION CTA */}
      {/* ========================================================================= */}
      <CTASection />

      {/* ========================================================================= */}
      {/* 8. STRUCTURED FOOTER */}
      {/* ========================================================================= */}
      <Footer onOpenLegalDoc={(type) => setLegalDocType(type)} />

      {/* Cookie Consent Banner */}
      <CookieConsent onOpenPrivacyModal={() => setLegalDocType('privacy')} />

      {/* Privacy Policy & Terms of Service Modal */}
      <LegalModal type={legalDocType} onClose={() => setLegalDocType(null)} />
    </div>
  );
};
