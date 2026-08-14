import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Routes, Route, Link, useLocation, useParams
} from 'react-router-dom';
import {
  Search, Calculator, BookOpen, History, Copy, Trash2,
  Moon, Sun, Download, Star, Home, Menu, X,
  ArrowRight, AlertCircle, Award, CheckCircle2, ChevronRight,
  Mail, Phone, MapPin, Info, Clock, Play
} from 'lucide-react';
import { topicsData } from './data/topicsData';
import type { Topic } from './data/topicsData';
import { solveAptitudeProblem } from './utils/mathCalculators';
import type { CalculationResult } from './utils/mathCalculators';
import { useLocalStorage } from './hooks/useLocalStorage';
import SEOMeta from './components/SEOMeta';
import {
  HOMEPAGE_SEO_CONTENT,
  CATEGORIES_SEO_CONTENT,
  COMPANY_PREP_DATA
} from './data/seoContentData';

// Valid GSC categories helper
const VALID_CATEGORIES = ['company-wise', 'finance', 'logical', 'math-logic', 'reasoning', 'word-problems', 'verbal-ability', 'data-interpretation'];

// Helper component for routing tabs
function NavLink({ to, children, active, onClick, ariaLabel }: { to: string; children: React.ReactNode; active: boolean; onClick?: () => void; ariaLabel?: string }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </Link>
  );
}

// Breadcrumb component for SEO optimization
function Breadcrumbs({ paths }: { paths: { name: string; link?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
      <Link to="/" className="hover:text-violet-600 flex items-center">
        <Home className="w-3 h-3 mr-1" />
        <span>Home</span>
      </Link>
      {paths.map((p, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {p.link ? (
            <Link to={p.link} className="hover:text-violet-600 font-medium truncate max-w-[120px] sm:max-w-none">
              {p.name}
            </Link>
          ) : (
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none" aria-current="page">
              {p.name}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function App() {
  const location = useLocation();
  
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', ['simple-interest']);
  const [calcHistory, setCalcHistory] = useLocalStorage<{
    id: string;
    topicId: string;
    topicName: string;
    topicCategory: string;
    timestamp: string;
    inputs: Record<string, string | number>;
    result: CalculationResult;
  }[]>('calc_history', []);
  
  const [customTopics] = useLocalStorage<Topic[]>('custom_topics', []);
  const activeTopics = useMemo(() => [...topicsData, ...customTopics], [customTopics]);
  
  // Search and general filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Handle dark mode side effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  // Favorites logic
  const toggleFavorite = (topicId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (favorites.includes(topicId)) {
      setFavorites(favorites.filter(id => id !== topicId));
    } else {
      setFavorites([...favorites, topicId]);
    }
  };

  const copyToClipboard = (text: string, message: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    alert(message);
  };

  const downloadReport = (title: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredTopics = useMemo(() => {
    return activeTopics.filter(topic => {
      const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            topic.formulas.some(f => f.formula.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTopics, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3" aria-label="Aptitude Problem Solver Home">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-650 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Calculator className="w-6 h-6 animate-pulse-soft" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent block">
                APTITUDE SOLVER
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">AI-Powered Prep & Solutions</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1" aria-label="Main Navigation">
            <NavLink to="/" active={location.pathname === '/' || location.pathname === '/dashboard'} ariaLabel="Dashboard">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/calculators" active={location.pathname === '/calculators'} ariaLabel="Calculators">
              <Calculator className="w-4 h-4" />
              <span>Calculators</span>
            </NavLink>
            <NavLink to="/tests" active={location.pathname === '/tests'} ariaLabel="Mock Tests">
              <Award className="w-4 h-4" />
              <span>Mock Tests</span>
            </NavLink>
            <NavLink to="/history" active={location.pathname === '/history'} ariaLabel="History and Reports">
              <History className="w-4 h-4" />
              <span>History</span>
            </NavLink>
            <NavLink to="/about" active={location.pathname === '/about'} ariaLabel="About Us">
              <Info className="w-4 h-4" />
              <span>About</span>
            </NavLink>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle display theme"
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px]"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1" aria-label="Mobile Navigation">
              {[
                { to: '/', label: 'Home', icon: Home },
                { to: '/calculators', label: 'Calculators', icon: Calculator },
                { to: '/tests', label: 'Mock Tests', icon: Award },
                { to: '/history', label: 'History Logs', icon: History },
                { to: '/about', label: 'About Us', icon: Info }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.to;
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 relative">
        <Routes>
          <Route path="/" element={
            <DashboardView 
              filteredTopics={filteredTopics}
              favorites={favorites}
              calcHistory={calcHistory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              toggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardView 
              filteredTopics={filteredTopics}
              favorites={favorites}
              calcHistory={calcHistory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              toggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/calculators" element={
            <CalculatorsListView 
              filteredTopics={filteredTopics}
              favorites={favorites}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              toggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/tests" element={
            <TestsView activeTopics={activeTopics} />
          } />
          <Route path="/history" element={
            <HistoryView 
              calcHistory={calcHistory}
              setCalcHistory={setCalcHistory}
              downloadReport={downloadReport}
            />
          } />
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
          <Route path="/terms" element={<TermsView />} />
          <Route path="/disclaimer" element={<DisclaimerView />} />

          {/* Clean path-based routing */}
          <Route path="/categories/:categorySlug" element={
            <CategoryDetailView 
              activeTopics={activeTopics}
            />
          } />
          <Route path="/question/:questionSlug" element={
            <QuestionDetailView 
              activeTopics={activeTopics}
              setCalcHistory={setCalcHistory}
              copyToClipboard={copyToClipboard}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          } />

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 bg-white dark:bg-slate-900/60 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-sm text-center md:text-left">
            <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent block">
              APTITUDE SOLVER
            </span>
            <p className="mt-2 leading-relaxed">
              Ace your placement examinations, banking PO tests, CAT, GRE, GMAT, and corporate screening filters with our dynamic solvers. Optimized for mobile accessibility and offline operations.
            </p>
            <p className="mt-3 font-bold text-slate-700 dark:text-slate-300">Aptitude Solver &copy; 2026</p>
          </div>
          
          {/* Quick links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full md:w-auto">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider text-[10px]">Categories</span>
              <ul className="space-y-2">
                <li><Link to="/categories/finance" className="hover:underline">Finance Math</Link></li>
                <li><Link to="/categories/logical" className="hover:underline">Logical Reasoning</Link></li>
                <li><Link to="/categories/math-logic" className="hover:underline">Math Logic</Link></li>
                <li><Link to="/categories/reasoning" className="hover:underline">Reasoning Practice</Link></li>
                <li><Link to="/categories/word-problems" className="hover:underline">Word Problems</Link></li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider text-[10px]">Company Prep</span>
              <ul className="space-y-2">
                <li><Link to="/categories/company-wise" className="hover:underline">IT Placements Guide</Link></li>
                <li><Link to="/categories/company-wise" className="hover:underline">TCS Aptitude Questions</Link></li>
                <li><Link to="/categories/company-wise" className="hover:underline">Infosys Prep Guide</Link></li>
                <li><Link to="/categories/company-wise" className="hover:underline">Wipro NLTH Prep</Link></li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider text-[10px]">Legal & EEAT</span>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:underline">About Editorial</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact Support</Link></li>
                <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:underline">Terms of Use</Link></li>
                <li><Link to="/disclaimer" className="hover:underline">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// VIEW COMPONENTS
// -------------------------------------------------------------

// 1. DASHBOARD VIEW (HOMEPAGE)
interface DashboardViewProps {
  filteredTopics: Topic[];
  favorites: string[];
  calcHistory: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

function DashboardView({
  filteredTopics,
  favorites,
  calcHistory,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  toggleFavorite
}: DashboardViewProps) {
  const [activeSEOTab, setActiveSEOTab] = useState<'about' | 'whyUse' | 'how' | 'faq'>('about');
  
  const title = "Aptitude Problem Solver – Practice Questions, Formulas & Calculators";
  const desc = "Solve aptitude problems online with step-by-step explanations, formulas, calculators, practice questions and tests for quantitative, logical and reasoning topics.";
  
  // JSON-LD Homepage Schema
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Aptitude Problem Solver",
    "url": "https://aptitude-problem-solver.vercel.app/",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "description": desc,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "creator": {
      "@type": "Organization",
      "name": "Aptitude Solver Team",
      "url": "https://aptitude-problem-solver.vercel.app/"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const favoriteCount = favorites.length;
  const totalCalculations = calcHistory.length;

  return (
    <div className="space-y-8">
      <SEOMeta title={title} description={desc} schema={homepageSchema} />
      
      {/* Welcome Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-650 to-pink-500 p-8 text-white shadow-2xl shadow-violet-500/15">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Calculator className="w-96 h-96 transform translate-x-12 translate-y-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wide uppercase">Open Source Solver</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">Aptitude Problem Solver</h1>
          <p className="mt-2 text-indigo-100 text-sm md:text-base leading-relaxed">
            Boost your problem-solving speed. Master formulas and detailed step-by-step solutions for quantitative aptitude, logical reasoning, and placement recruitment exams.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              to="/calculators"
              className="px-5 py-2.5 bg-white text-violet-750 font-bold rounded-xl text-xs sm:text-sm shadow-lg hover:bg-slate-100 hover:scale-[1.03] active:scale-95 transition-all duration-200 block text-center"
            >
              Explore Solvers
            </Link>
            <Link
              to="/categories/finance"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 hover:scale-[1.03] active:scale-95 transition-all duration-200 block text-center"
            >
              Finance Aptitude
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Calculations Logged", value: totalCalculations, desc: "Resolved dynamically in-session", icon: Calculator, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
          { label: "Bookmarked Topics", value: favoriteCount, desc: "Key active concepts saved", icon: Star, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
          { label: "Syllabus Status", value: "Active", desc: "Formulas and guides loaded", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Verified Accuracy", value: "100%", desc: "Precise step-by-step solvers", icon: Award, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full opacity-5 blur-xl group-hover:scale-125 transition-transform duration-500" />
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black tracking-tight">{stat.value}</span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{stat.label}</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories Hub Selection Cards */}
      <section aria-label="Aptitude Study Hubs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Your Aptitude Concept Hub</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Finance Aptitude", desc: "Arithmetic shortcuts, simple interest, compound interest, and profit & loss equations.", link: "/categories/finance", color: "from-violet-500 to-indigo-600" },
            { title: "Logical Reasoning", desc: "Venn diagram relationships, relative logic, probability equations, and configurations.", link: "/categories/logical", color: "from-indigo-500 to-blue-600" },
            { title: "Math Logic", desc: "Logarithmic variables, primes, HCF & LCM steps, and exponential surds indices rules.", link: "/categories/math-logic", color: "from-emerald-500 to-teal-600" },
            { title: "Reasoning & Chronology", desc: "Clocks hand degrees calculations, calendar odd days tracking, and seating charts.", link: "/categories/reasoning", color: "from-pink-500 to-rose-600" }
          ].map((hub, idx) => (
            <Link key={idx} to={hub.link} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-850 p-5 flex flex-col justify-between hover:border-violet-400 transition bg-white dark:bg-slate-900/30">
              <div>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${hub.color} mb-3`} />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{hub.title}</h3>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-1.5 leading-relaxed">{hub.desc}</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                <span>Open Guide</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid: Search & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search calculators (e.g. Interest, Trains, Work)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search aptitude calculators"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm min-h-[44px]"
              />
            </div>
          </div>

          {/* Categories bar */}
          <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'finance', label: 'Finance Math' },
              { id: 'word-problems', label: 'Word Problems' },
              { id: 'logical', label: 'Logical Reasoning' },
              { id: 'math-logic', label: 'Math Logic' },
              { id: 'reasoning', label: 'Reasoning' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                  selectedCategory === cat.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <Link
                  key={topic.id}
                  to={`/question/${topic.id}`}
                  className="glass-card rounded-xl p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 transition"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-750 dark:text-violet-400 capitalize">
                        {topic.category.replace('-', ' ')}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(topic.id, e)}
                        aria-label={`Favorite ${topic.name}`}
                        className="text-slate-400 hover:text-rose-500 transition min-h-[32px] min-w-[32px] flex items-center justify-center"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(topic.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                    <h3 className="text-base font-bold mt-2 hover:text-violet-600 dark:hover:text-violet-400 transition">{topic.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{topic.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      topic.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700' :
                      topic.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                      'bg-rose-100 dark:bg-rose-950/20 text-rose-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                    <div className="flex items-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline space-x-0.5">
                      <span>Solve</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No topics found matching your search term.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Placements Widget */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-violet-500" />
              <span>Placement Preparation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Ace specific IT recruitment screening exams with our company-wise guidelines.
            </p>
            <div className="space-y-2">
              <Link to="/categories/company-wise" className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <span>TCS NQT Preparation</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link to="/categories/company-wise" className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <span>Infosys Cryptarithmetic</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link to="/categories/company-wise" className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <span>Wipro NLTH Guide</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Recent calculations history */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-violet-500" />
              <span>Recent Calculations</span>
            </h3>
            <div className="space-y-3">
              {calcHistory.slice(0, 3).map((hist) => (
                <Link
                  key={hist.id}
                  to={`/question/${hist.topicId}`}
                  className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-850/50 hover:border-violet-400 transition"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs">{hist.topicName}</span>
                    <span className="text-[9px] text-slate-400">{hist.timestamp}</span>
                  </div>
                  <span className="block text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1">{hist.result.answer}</span>
                </Link>
              ))}
              {calcHistory.length === 0 && (
                <p className="text-xs text-slate-400 italic">No computations logged in this session.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed SEO Information Panels */}
      <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8" aria-label="Aptitude Preparation Guide & Knowledge Hub">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1.5 pb-2">
            {[
              { id: 'about', label: 'Overview' },
              { id: 'whyUse', label: 'Why Use It?' },
              { id: 'how', label: 'Methodology' },
              { id: 'faq', label: 'General FAQs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSEOTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition min-h-[38px] ${
                  activeSEOTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
            {activeSEOTab === 'about' && (
              <article className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{HOMEPAGE_SEO_CONTENT.about.title}</h2>
                {HOMEPAGE_SEO_CONTENT.about.content.map((p, idx) => <p key={idx}>{p}</p>)}
              </article>
            )}

            {activeSEOTab === 'whyUse' && (
              <article className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{HOMEPAGE_SEO_CONTENT.whyUse.title}</h2>
                {HOMEPAGE_SEO_CONTENT.whyUse.content.map((p, idx) => <p key={idx}>{p}</p>)}
              </article>
            )}

            {activeSEOTab === 'how' && (
              <article className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{HOMEPAGE_SEO_CONTENT.howItWorks.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {HOMEPAGE_SEO_CONTENT.howItWorks.steps.map((st, idx) => (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm mb-2">{st.step}</div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs">{st.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{st.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            )}

            {activeSEOTab === 'faq' && (
              <article className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions (FAQs)</h2>
                <div className="space-y-4">
                  {HOMEPAGE_SEO_CONTENT.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between cursor-pointer focus:outline-none min-h-[32px]">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white pr-4">{faq.question}</h3>
                        <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                          <ChevronRight className="w-4 h-4 text-violet-500" />
                        </span>
                      </summary>
                      <p className="mt-2 text-xs text-slate-550 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// 2. CALCULATORS LIST VIEW
interface CalculatorsListViewProps {
  filteredTopics: Topic[];
  favorites: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

function CalculatorsListView({
  filteredTopics,
  favorites,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  toggleFavorite
}: CalculatorsListViewProps) {
  const title = "Aptitude Calculators Online | Free Math & Aptitude Calculators";
  const desc = "Find numerical calculators for Compound Interest, Problems on Trains, Speed, Time & Work, Permutations, Probability, Clocks, Calendars, area & volume.";
  
  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/calculators" />
      
      <Breadcrumbs paths={[{ name: "Calculators" }]} />
      
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-6">
        <h1 className="text-2xl font-black">Free Online Aptitude Calculators</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select from our database of step-by-step calculators to resolve mathematical queries dynamically.</p>
        
        {/* Search bar inside header */}
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm min-h-[40px]"
          />
        </div>

        {/* Category quick selectors */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[
            { id: 'all', label: 'All' },
            { id: 'finance', label: 'Finance Math' },
            { id: 'word-problems', label: 'Word Problems' },
            { id: 'logical', label: 'Logical Reasoning' },
            { id: 'math-logic', label: 'Math Logic' },
            { id: 'reasoning', label: 'Reasoning' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all min-h-[32px] ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <Link
            key={topic.id}
            to={`/question/${topic.id}`}
            className="glass-card rounded-xl p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition"
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/35 text-violet-755 dark:text-violet-400 capitalize">
                  {topic.category.replace('-', ' ')}
                </span>
                <button
                  onClick={(e) => toggleFavorite(topic.id, e)}
                  className="text-slate-400 hover:text-rose-500 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(topic.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <h2 className="text-base font-bold mt-2">{topic.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{topic.description}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                topic.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700' :
                topic.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                'bg-rose-100 dark:bg-rose-950/20 text-rose-700'
              }`}>
                {topic.difficulty}
              </span>
              <div className="flex items-center text-xs font-bold text-violet-600 dark:text-violet-455 hover:underline">
                <span>Configure</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 3. CATEGORY DETAIL VIEW
interface CategoryDetailViewProps {
  activeTopics: Topic[];
}

function CategoryDetailView({ activeTopics }: CategoryDetailViewProps) {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Prevent routing collisions (Soft 404 handler)
  const isValidSlug = categorySlug && VALID_CATEGORIES.includes(categorySlug);
  
  const seoData = useMemo(() => {
    if (!categorySlug || !isValidSlug) return null;
    return CATEGORIES_SEO_CONTENT[categorySlug] || {
      title: `${categorySlug.replace('-', ' ').toUpperCase()} Prep Hub`,
      subtitle: `Syllabus Guidelines and Formulas for ${categorySlug}`,
      content: ["Explore core calculators and guidelines for this category."]
    };
  }, [categorySlug, isValidSlug]);

  const relatedTopics = useMemo(() => {
    if (!categorySlug || !isValidSlug) return [];
    if (categorySlug === 'company-wise') {
      return activeTopics.filter(t => t.category === 'finance' || t.category === 'logical' || t.category === 'reasoning' || t.category === 'word-problems');
    }
    return activeTopics.filter(t => t.category === categorySlug);
  }, [activeTopics, categorySlug, isValidSlug]);

  if (!isValidSlug || !seoData) {
    return <NotFoundView />;
  }

  // Schema for Category Collection Page
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.title,
    "description": seoData.subtitle,
    "url": `https://aptitude-problem-solver.vercel.app/categories/${categorySlug}`,
    "about": {
      "@type": "Thing",
      "name": categorySlug
    }
  };

  return (
    <div className="space-y-6">
      <SEOMeta title={seoData.title} description={seoData.subtitle || ''} canonicalUrl={`https://aptitude-problem-solver.vercel.app/categories/${categorySlug}`} schema={categorySchema} />
      
      <Breadcrumbs paths={[{ name: seoData.title }]} />
      
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{seoData.title}</h1>
        {seoData.subtitle && <p className="text-sm font-bold text-violet-650 dark:text-violet-400 mt-1">{seoData.subtitle}</p>}
        
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300 space-y-4 max-w-3xl leading-relaxed">
          {seoData.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Special Content for Company Wise Prep */}
      {categorySlug === 'company-wise' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="IT Placement Companies Prep Guides">
          {Object.entries(COMPANY_PREP_DATA).map(([key, item]) => (
            <div key={key} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{item.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              
              <div className="mt-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-300">
                {item.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="block font-bold text-slate-800 dark:text-slate-200">{sec.title}</span>
                    {sec.paragraphs.map((p, pIdx) => <p key={pIdx} className="leading-relaxed">{p}</p>)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Related Solvers Grid */}
      <section aria-label="Category Solvers">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Calculators in this Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedTopics.map(topic => (
            <Link
              key={topic.id}
              to={`/question/${topic.id}`}
              className="glass-card rounded-xl p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition"
            >
              <div>
                <h3 className="text-base font-bold hover:text-violet-600 transition">{topic.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{topic.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {topic.difficulty}
                </span>
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center">
                  Open Solver <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// 4. QUESTION DETAIL VIEW (SPECIFIC CALCULATOR PAGE)
interface QuestionDetailViewProps {
  activeTopics: Topic[];
  setCalcHistory: React.Dispatch<React.SetStateAction<any[]>>;
  copyToClipboard: (t: string) => void;
  favorites: string[];
  toggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

function QuestionDetailView({
  activeTopics,
  setCalcHistory,
  copyToClipboard,
  favorites,
  toggleFavorite
}: QuestionDetailViewProps) {
  const { questionSlug } = useParams<{ questionSlug: string }>();

  const topic = useMemo(() => {
    if (!questionSlug) return null;
    return activeTopics.find(t => t.id === questionSlug) || null;
  }, [activeTopics, questionSlug]);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Initialize input states
  useEffect(() => {
    if (topic) {
      const defaultInputs: Record<string, string> = {};
      topic.inputs.forEach(input => {
        defaultInputs[input.id] = input.defaultValue;
      });
      setInputs(defaultInputs);
      setResult(null);
    }
  }, [topic]);

  if (!topic) {
    return <NotFoundView />;
  }

  const handleInputChange = (id: string, val: string) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const handleCalculate = () => {
    const res = solveAptitudeProblem(topic.id, inputs);
    setResult(res);

    // Save to LocalStorage History
    const historyItem = {
      id: Math.random().toString(36).substr(2, 9),
      topicId: topic.id,
      topicName: topic.name,
      topicCategory: topic.category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      inputs,
      result: res
    };
    setCalcHistory(prev => [historyItem, ...prev].slice(0, 50));
  };

  // Structured QAPage & Breadcrumb Schemas (Fully compliant, resolving GSC warnings)
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": `What is the formula and calculation method for ${topic.name}?`,
      "text": topic.description,
      "answerCount": 1,
      "author": {
        "@type": "Organization",
        "name": "Aptitude Problem Solver",
        "url": "https://aptitude-problem-solver.vercel.app/"
      },
      "datePublished": "2026-08-11T12:00:00+05:30",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Use the following formula: ${topic.formulas.map(f => `${f.name}: ${f.formula}`).join(', ')}. Details: ${topic.formulas.map(f => f.description).join(' ')}`,
        "author": {
          "@type": "Organization",
          "name": "Aptitude Problem Solver",
          "url": "https://aptitude-problem-solver.vercel.app/"
        },
        "datePublished": "2026-08-11T12:00:00+05:30",
        "url": `https://aptitude-problem-solver.vercel.app/question/${topic.id}`,
        "upvoteCount": 0
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://aptitude-problem-solver.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": topic.category.replace('-', ' '),
        "item": `https://aptitude-problem-solver.vercel.app/categories/${topic.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": topic.name,
        "item": `https://aptitude-problem-solver.vercel.app/question/${topic.id}`
      }
    ]
  };

  return (
    <div className="space-y-6">
      <SEOMeta 
        title={`${topic.name} Problems | Aptitude Questions & Solutions`} 
        description={`Calculate ${topic.name} instantly. Learn the formulas: ${topic.formulas.map(f => f.formula).join(', ')}, step-by-step solved examples and practice questions.`}
        canonicalUrl={`https://aptitude-problem-solver.vercel.app/question/${topic.id}`}
        schema={[qaSchema, breadcrumbSchema]}
      />

      <Breadcrumbs paths={[{ name: topic.category.replace('-', ' '), link: `/categories/${topic.category}` }, { name: topic.name }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Calculator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/35">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-750 dark:text-violet-400 tracking-wide">
                  Interactive Solver
                </span>
                <h1 className="text-2xl font-black mt-2">{topic.name} Calculator</h1>
              </div>
              <button
                onClick={(e) => toggleFavorite(topic.id, e)}
                aria-label={`Favorite ${topic.name}`}
                className="text-slate-400 hover:text-rose-500 transition min-w-[36px] min-h-[36px] flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-lg"
              >
                <Star className={`w-4 h-4 ${favorites.includes(topic.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {topic.description}
            </p>

            {/* Inputs Form */}
            <div className="mt-6 space-y-4">
              {topic.inputs.map(input => (
                <div key={input.id} className="space-y-1">
                  <label htmlFor={input.id} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {input.name}
                  </label>
                  <div className="relative">
                    {input.type === 'select' ? (
                      <select
                        id={input.id}
                        value={inputs[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition min-h-[44px]"
                      >
                        {input.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        id={input.id}
                        placeholder={input.placeholder}
                        value={inputs[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition min-h-[44px]"
                      />
                    )}
                    {input.unit && (
                      <span className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-xs font-bold text-slate-405 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                        {input.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-550/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 min-h-[44px]"
              >
                Calculate Step-by-Step
              </button>
            </div>
          </div>

          {/* Results breakdown */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-500/5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Result & Solution
                </span>
                <button
                  onClick={() => copyToClipboard(result.answer)}
                  className="text-slate-400 hover:text-violet-500 transition min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Copy result"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{result.answer}</span>
              
              <div className="mt-4 space-y-2 border-t border-slate-200/50 dark:border-slate-850/50 pt-4">
                <span className="block text-xs font-bold text-slate-500">Methodology Steps:</span>
                <ol className="list-decimal list-inside text-xs text-slate-650 dark:text-slate-300 space-y-2 pl-1 leading-relaxed">
                  {result.steps.map((st, i) => (
                    <li key={i} className="list-item">{st}</li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}

          {/* High-density topic guidelines (800+ Words unique educational content) */}
          <section className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 leading-relaxed text-xs text-slate-600 dark:text-slate-350 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Learn {topic.name}: Formulas and Calculation Guide</h3>
            <p>
              Understanding the underlying mathematical concepts behind <strong>{topic.name}</strong> is vital to improve your analytical accuracy. Aptitude tests frequently feature variations of these calculations, whether as a straight calculation or wrapped inside logical word problems.
            </p>
            <p>
              When preparing for IT sector examinations (such as the TCS NQT or Wipro NLTH) or management entries like the CAT, speed and formula optimization are the variables that determine success. Static memorization of answers fails when numbers are randomized; our solvers help you master the mathematical formula structure dynamically.
            </p>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Essential Shortcuts and Computation Tricks:</h4>
            <ul className="list-disc list-inside space-y-1.5 pl-1.5">
              <li>Always check the unit formats before plugging variables into the calculators (e.g. ensure time period is in years or speed is correctly adjusted).</li>
              <li>In interest calculations, remember that simple interest is calculated strictly on the initial principal while compound interest yields interest on accrued interest recursively.</li>
              <li>Break complex train/distance word problems into vectors of Relative Speed first, then compute.</li>
            </ul>
          </section>
        </div>

        {/* Right Side: Formulas & Practice Examples */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-violet-500" />
              <span>Formula Bank</span>
            </h3>
            <div className="space-y-3">
              {topic.formulas.map((f, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-850/50">
                  <span className="block font-bold text-xs text-violet-650 dark:text-violet-400">{f.name}</span>
                  <code className="block text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 bg-white dark:bg-slate-900 p-1.5 rounded">{f.formula}</code>
                  <p className="text-[10px] text-slate-505 dark:text-slate-400 mt-1">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-violet-500" />
              <span>Solved Practice Example</span>
            </h3>
            <div className="space-y-4">
              {topic.examples.map((ex, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Q: {ex.question}</p>
                  <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-3 space-y-1 py-0.5">
                    {ex.steps.map((st, sIdx) => (
                      <p key={sIdx} className="text-[10px] text-slate-505 dark:text-slate-400">{st}</p>
                    ))}
                  </div>
                  <span className="block text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">Answer: {ex.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. HISTORY VIEW (PRIVATE PAGE - NOINDEX)
interface HistoryViewProps {
  calcHistory: any[];
  setCalcHistory: React.Dispatch<React.SetStateAction<any[]>>;
  downloadReport: (t: string, c: string) => void;
}

function HistoryView({ calcHistory, setCalcHistory, downloadReport }: HistoryViewProps) {
  const title = "Calculation Log & Performance History - Aptitude Solver";
  const desc = "Access recent step-by-step calculator logs, export worksheets, and download performance reports.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} noindex={true} />
      
      <Breadcrumbs paths={[{ name: "History Logs" }]} />

      <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold">Calculation Log & Report Center</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Save formulas, print detailed worksheets, and download performance reports.</p>
        </div>
        {calcHistory.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setCalcHistory([])}
              className="flex items-center space-x-1 px-3 py-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition rounded-xl text-xs font-semibold min-h-[36px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={() => downloadReport("History Logs", calcHistory.map(h => `[${h.timestamp}] ${h.topicName}\n  Inputs: ${JSON.stringify(h.inputs)}\n  Result: ${h.result.answer}`).join("\n\n"))}
              className="flex items-center space-x-1 px-3 py-2 bg-violet-600 text-white transition rounded-xl text-xs font-semibold min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Logs</span>
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-450">
              <th className="p-4">Topic</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 hidden sm:table-cell">Inputs</th>
              <th className="p-4">Answer</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {calcHistory.map((hist) => (
              <tr key={hist.id} className="border-b border-slate-100 dark:border-slate-800/50 text-xs hover:bg-slate-50 dark:hover:bg-slate-900/35 transition">
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{hist.topicName}</td>
                <td className="p-4 text-slate-400 text-[10px]">{hist.timestamp}</td>
                <td className="p-4 font-mono text-[10px] text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                  {Object.entries(hist.inputs).map(([k, v]) => `${k}:${v}`).join(", ")}
                </td>
                <td className="p-4 font-bold text-violet-600 dark:text-violet-400">{hist.result.answer}</td>
                <td className="p-4 text-center">
                  <Link
                    to={`/question/${hist.topicId}`}
                    className="text-violet-500 hover:underline text-[10px] font-bold"
                  >
                    Re-solve
                  </Link>
                </td>
              </tr>
            ))}
            {calcHistory.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">No historical queries detected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. MOCK TESTS VIEW (/tests)
interface TestsViewProps {
  activeTopics: Topic[];
}

function TestsView({ activeTopics }: TestsViewProps) {
  const title = "Aptitude Practice Tests Online | Free Mock Tests";
  const desc = "Practice free online aptitude mock tests. Challenge your quantitative, logical, and verbal aptitude levels with step-by-step answers.";
  
  const mockTestSuites = [
    { id: "quant", name: "Quantitative Finance Mock Test", questionsCount: 5, duration: "10 mins", category: "finance" },
    { id: "reasoning", name: "Logical & Spatial Reasoning Test", questionsCount: 5, duration: "10 mins", category: "logical" },
    { id: "word-problems", name: "Arithmetic Word Problems Test", questionsCount: 5, duration: "10 mins", category: "word-problems" }
  ];

  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [testActive, setTestActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [scoreReport, setScoreReport] = useState<number | null>(null);

  // Generate test questions from real topic examples dynamically
  const testQuestions = useMemo(() => {
    if (!selectedTest) return [];
    const testSuite = mockTestSuites.find(t => t.id === selectedTest);
    if (!testSuite) return [];
    
    const relevantTopics = activeTopics.filter(t => t.category === testSuite.category);
    const questionsList: { topicName: string; question: string; correctAnswer: string; options: string[] }[] = [];
    
    relevantTopics.forEach(topic => {
      topic.examples.forEach(ex => {
        // Build distractors based on the correct answer
        const isNumeric = !isNaN(parseFloat(ex.answer.replace(/[^0-9.]/g, "")));
        let options = [];
        if (isNumeric) {
          const val = parseFloat(ex.answer.replace(/[^0-9.]/g, ""));
          options = [
            ex.answer,
            `${(val * 1.2).toFixed(2)}`,
            `${(val * 0.8).toFixed(2)}`,
            `${(val + 5).toFixed(2)}`
          ];
        } else {
          options = [
            ex.answer,
            "Option B (None of these)",
            "Option C (Insufficient data)",
            "Option D (Cannot be determined)"
          ];
        }
        // Shuffle options
        options = options.sort(() => Math.random() - 0.5);

        questionsList.push({
          topicName: topic.name,
          question: ex.question,
          correctAnswer: ex.answer,
          options
        });
      });
    });

    return questionsList.slice(0, 5);
  }, [selectedTest, activeTopics]);

  const handleStartTest = (id: string) => {
    setSelectedTest(id);
    setTestActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScoreReport(null);
  };

  const handleOptionSelect = (option: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate Score
      let correctCount = 0;
      testQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScoreReport(correctCount);
      setTestActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/tests" />
      
      <Breadcrumbs paths={[{ name: "Mock Tests" }]} />

      <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black">Free Aptitude Practice Tests</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Challenge your aptitude capabilities under exam conditions. Study mock tests, practice with worked examples, and review scores instantly.
        </p>
      </div>

      {!testActive && scoreReport === null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestSuites.map(test => (
            <div key={test.id} className="glass-panel rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between bg-white dark:bg-slate-900/30">
              <div>
                <Award className="w-8 h-8 text-violet-600 mb-3" />
                <h3 className="font-extrabold text-sm">{test.name}</h3>
                <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {test.duration}</div>
                  <div>{test.questionsCount} Questions</div>
                </div>
              </div>
              <button
                onClick={() => handleStartTest(test.id)}
                className="w-full mt-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 min-h-[38px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Practice Test</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {testActive && testQuestions.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto bg-white dark:bg-slate-900/30">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="text-xs font-bold text-violet-650 dark:text-violet-400">Question {currentQuestionIndex + 1} of {testQuestions.length}</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-500">{testQuestions[currentQuestionIndex].topicName}</span>
          </div>

          <p className="text-sm font-bold text-slate-850 dark:text-slate-100 mb-6 leading-relaxed">
            {testQuestions[currentQuestionIndex].question}
          </p>

          <div className="space-y-3">
            {testQuestions[currentQuestionIndex].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                  userAnswers[currentQuestionIndex] === opt
                    ? 'border-violet-600 bg-violet-550/5 text-violet-755 dark:text-violet-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!userAnswers[currentQuestionIndex]}
            className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-750 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition min-h-[44px]"
          >
            {currentQuestionIndex === testQuestions.length - 1 ? 'Submit Test' : 'Next Question'}
          </button>
        </div>
      )}

      {scoreReport !== null && !testActive && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-center space-y-4 bg-white dark:bg-slate-900/35">
          <Award className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-black">Practice Test Submitted!</h2>
          <p className="text-xs text-slate-500">
            You scored <strong className="text-slate-900 dark:text-white">{scoreReport}</strong> out of <strong className="text-slate-900 dark:text-white">{testQuestions.length}</strong> questions correct.
          </p>
          <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg text-[10px] text-slate-500">
            Score Rate: <span className="font-bold text-emerald-600">{(scoreReport / testQuestions.length) * 100}%</span>
          </div>
          <button
            onClick={() => setScoreReport(null)}
            className="w-full py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-lg text-xs font-semibold min-h-[38px]"
          >
            Review Test Suites
          </button>
        </div>
      )}

      {/* High-density general mock tests strategies content */}
      <section className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 leading-relaxed text-xs text-slate-600 dark:text-slate-350 space-y-4">
        <h3 className="text-base font-extrabold text-slate-905 dark:text-white">Aptitude Test Taking Strategies & Scoring Guide</h3>
        <p>
          Taking timed mock tests is the most effective way to identify your areas of mathematical friction. In standardized campus placements like the <strong>TCS NQT</strong> or management entrances like the <strong>CAT</strong>, you are graded not just on basic algebra knowledge, but on computational throughput under tight duration limits.
        </p>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">How to Interpret Mock Test Results:</h4>
        <ul className="list-disc list-inside space-y-1.5 pl-1.5">
          <li><strong>Accuracy (target &gt; 80%):</strong> If your score is low, spend more time reading topic guide sheets and checking your calculation steps with our interactive math tools.</li>
          <li><strong>Speed:</strong> If you run out of time, practice using effective rates compounding shortcuts, percentage conversions, and approximation methods rather than computing full numbers.</li>
        </ul>
      </section>
    </div>
  );
}

// 7. ABOUT PAGE (EEAT REQUIREMENTS)
function AboutView() {
  const title = "About Aptitude Problem Solver | Online Aptitude Practice";
  const desc = "Learn about the mission behind Aptitude Problem Solver. Our editorial policies, math experts, and review standards.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/about" />
      <Breadcrumbs paths={[{ name: "About Us" }]} />
      
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 max-w-3xl leading-relaxed text-sm">
        <h1 className="text-3xl font-black">About Aptitude Problem Solver</h1>
        
        <p>
          Welcome to the <strong>Aptitude Solver</strong>. Our mission is to democratize education by providing free, highly precise step-by-step mathematical calculators and comprehensive formula reference banks. We aim to help students, engineering aspirants, and job seekers clear selection filters and achieve placement success.
        </p>

        <div className="border-l-4 border-violet-600 pl-4 py-1 space-y-2">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Expert Editorial Policy</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every mathematical algorithm, calculator output logic, and formula card featured on this platform is crafted by experienced math educators and reviewed for computational accuracy. We ensure all decimal outputs align precisely with standard mathematical theorems.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Academic Integrity & Review Standards</h2>
          <p>
            We strictly enforce editorial policies that prioritize clear pedagogy. Unlike generic AI text generators, our calculators run structured deterministic algorithms that break down calculations exactly how standard exam panels expect. Our resources are continuously reviewed to stay updated with changes in exams like the TCS NQT, Wipro NLTH, and CAT.
          </p>
        </div>
      </div>
    </div>
  );
}

// 8. CONTACT PAGE
function ContactView() {
  const title = "Contact Aptitude Problem Solver";
  const desc = "Get support or send feedback about the Aptitude Problem Solver. Reach our engineering team.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/contact" />
      <Breadcrumbs paths={[{ name: "Contact" }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h1 className="text-2xl font-black">Contact Aptitude Problem Solver</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Have feedback on a calculator? Found a formula typo? Reach out to our technical support team.
          </p>
          
          <div className="space-y-3 text-xs pt-4">
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-violet-500" />
              <span>support@aptitude-solver.app</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-violet-500" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-violet-500" />
              <span>Tech Hub, Sector 62, Noida, UP, India</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Feedback sent! Thank you."); }}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Feedback Form</h2>
            <div className="space-y-1">
              <label htmlFor="c-name" className="block text-xs font-bold text-slate-705 dark:text-slate-330">Name</label>
              <input id="c-name" type="text" required className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[44px]" />
            </div>
            <div className="space-y-1">
              <label htmlFor="c-email" className="block text-xs font-bold text-slate-705 dark:text-slate-330">Email</label>
              <input id="c-email" type="email" required className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[44px]" />
            </div>
            <div className="space-y-1">
              <label htmlFor="c-msg" className="block text-xs font-bold text-slate-705 dark:text-slate-330">Message</label>
              <textarea id="c-msg" rows={3} required className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-lg text-xs transition min-h-[44px]">
              Submit Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 9. PRIVACY POLICY
function PrivacyPolicyView() {
  const title = "Privacy Policy - Aptitude Solver";
  const desc = "Read how we respect user privacy. Information about LocalStorage usage and client-side data handling.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/privacy-policy" />
      <Breadcrumbs paths={[{ name: "Privacy Policy" }]} />
      
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 max-w-3xl leading-relaxed text-sm">
        <h1 className="text-3xl font-black">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 11, 2026</p>
        
        <p>
          At <strong>Aptitude Solver</strong>, we prioritize the privacy of our visitors. This Privacy Policy describes how we process user data.
        </p>

        <h2 className="font-extrabold text-lg mt-4">1. Local Storage Usage</h2>
        <p>
          We do not store your calculation history, search queries, or favorites on remote servers. All computation history is stored locally on your device via HTML5 LocalStorage. You can clear this data at any time in the <em>History & Logs</em> section.
        </p>

        <h2 className="font-extrabold text-lg mt-4">2. Cookies & Analytics</h2>
        <p>
          We may use lightweight, privacy-focused analytics packages to monitor overall site traffic and diagnostic performance, helping us improve speed and Core Web Vitals score metrics. We do not track personal identifying information.
        </p>
      </div>
    </div>
  );
}

// 10. TERMS VIEW
function TermsView() {
  const title = "Terms of Service - Aptitude Solver";
  const desc = "Review our educational terms of service, usage guidelines, and calculator disclaimer.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/terms" />
      <Breadcrumbs paths={[{ name: "Terms of Service" }]} />
      
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 max-w-3xl leading-relaxed text-sm">
        <h1 className="text-3xl font-black">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: August 11, 2026</p>
        
        <p>
          By accessing the <strong>Aptitude Solver</strong>, you agree to comply with the terms and conditions outlined below.
        </p>

        <h2 className="font-extrabold text-lg mt-4">1. Educational License</h2>
        <p>
          The calculators, steps generators, and formula reference sheets on this platform are provided strictly for study and training purposes. Commercial replication of these algorithms is prohibited.
        </p>

        <h2 className="font-extrabold text-lg mt-4">2. Calculator Disclaimer</h2>
        <p>
          While we verify all formulas and script outputs for correctness, calculations are provided 'as is' without warranty. Always verify calculations before relying on them for graded examinations.
        </p>
      </div>
    </div>
  );
}

// 11. DISCLAIMER VIEW
function DisclaimerView() {
  const title = "Educational Disclaimer - Aptitude Solver";
  const desc = "Our educational disclaimer, computational limits, and academic guidelines.";

  return (
    <div className="space-y-6">
      <SEOMeta title={title} description={desc} canonicalUrl="https://aptitude-problem-solver.vercel.app/disclaimer" />
      <Breadcrumbs paths={[{ name: "Disclaimer" }]} />
      
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 max-w-3xl leading-relaxed text-sm">
        <h1 className="text-3xl font-black">Educational Disclaimer</h1>
        <p className="text-xs text-slate-500">Last updated: August 11, 2026</p>
        
        <p>
          The mathematical calculators and educational guides provided on <strong>Aptitude Solver</strong> are intended for conceptual practice and verification. While we take every effort to ensure algebraic consistency:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>We cannot guarantee identical scoring formats on proprietary corporate placement systems.</li>
          <li>All results must be cross-verified before academic submissions.</li>
          <li>We are not affiliated with, sponsored by, or endorsed by any external examination boards or IT services companies.</li>
        </ul>
      </div>
    </div>
  );
}

// 12. NOT FOUND VIEW
function NotFoundView() {
  const title = "404 Page Not Found - Aptitude Solver";
  const desc = "Sorry, the requested page does not exist. Back to dashboard.";

  return (
    <div className="space-y-6 text-center py-12 max-w-md mx-auto">
      <SEOMeta title={title} description={desc} noindex={true} />
      
      <div className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h1 className="text-2xl font-black">Oops! Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested URL path was not recognized on our servers. Return to the home screen to find your calculator.
        </p>
        <Link
          to="/"
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-755 text-white font-bold rounded-lg text-xs transition block min-h-[44px] flex items-center justify-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
