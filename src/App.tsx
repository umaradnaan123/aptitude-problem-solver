import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calculator, BookOpen, History, Copy, Trash2,
  Moon, Sun, Download, ExternalLink, Star, Home, Menu, X,
  ArrowRight, AlertCircle
} from 'lucide-react';
import { topicsData } from './data/topicsData';
import type { Topic } from './data/topicsData';
import { solveAptitudeProblem } from './utils/mathCalculators';
import type { CalculationResult } from './utils/mathCalculators';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  // Navigation & Views
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'calculators' | 'formulas' | 'history'>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string>("simple-interest");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // States & Local Persistence
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', ['simple-interest']);
  const [calcHistory, setCalcHistory] = useLocalStorage<{
    id: string;
    topicId: string;
    topicName: string;
    timestamp: string;
    inputs: Record<string, string | number>;
    result: CalculationResult;
  }[]>('calc_history', []);

  const [customTopics] = useLocalStorage<Topic[]>('custom_topics', []);

  // Calculation states
  const activeTopics = useMemo(() => [...topicsData, ...customTopics], [customTopics]);
  const activeTopic = useMemo(() => activeTopics.find(t => t.id === selectedTopicId) || activeTopics[0], [activeTopics, selectedTopicId]);

  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, string>>({});
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);

  // Reset inputs when switching topics
  useEffect(() => {
    const defaultInputs: Record<string, string> = {};
    activeTopic.inputs.forEach(input => {
      defaultInputs[input.id] = input.defaultValue;
    });
    setCalculatorInputs(defaultInputs);
    setCalcResult(null);
  }, [selectedTopicId, activeTopic]);

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

  // Statistics calculations
  const totalCalculations = calcHistory.length;
  const favoriteCount = favorites.length;

  const toggleFavorite = (topicId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (favorites.includes(topicId)) {
      setFavorites(favorites.filter(id => id !== topicId));
    } else {
      setFavorites([...favorites, topicId]);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setCalculatorInputs(prev => ({ ...prev, [id]: value }));
  };

  const executeCalculation = () => {
    const result = solveAptitudeProblem(activeTopic.id, calculatorInputs);
    setCalcResult(result);

    // Save to history
    const historyItem = {
      id: Math.random().toString(36).substr(2, 9),
      topicId: activeTopic.id,
      topicName: activeTopic.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
      inputs: calculatorInputs,
      result
    };
    setCalcHistory(prev => [historyItem, ...prev].slice(0, 50));
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

  // Filter topics based on search query and category tab
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Calculator className="w-6 h-6 animate-pulse-soft" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                APTITUDE PROBLEM SOLVER
              </span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">AI-Powered Platform</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'calculators', label: 'Calculators', icon: Calculator },
              { id: 'formulas', label: 'Formula Bank', icon: BookOpen },
              { id: 'history', label: 'History & Reports', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
            <div className="px-4 py-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'calculators', label: 'Calculators', icon: Calculator },
                { id: 'formulas', label: 'Formula Bank', icon: BookOpen },
                { id: 'history', label: 'History & Reports', icon: History }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 relative">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Welcome card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 p-8 text-white shadow-2xl shadow-violet-500/15">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <Calculator className="w-96 h-96 transform translate-x-12 translate-y-12" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide uppercase">Premium Solver</span>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">Boost Your Aptitude Performance</h1>
                  <p className="mt-2 text-indigo-100 text-sm md:text-base leading-relaxed">
                    Instant step-by-step math solver, extensive formulas reference, and progress dashboard metrics to ace placement exams and competitive assessments.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setCurrentTab('calculators')}
                      className="px-5 py-2.5 bg-white text-violet-700 font-bold rounded-xl text-xs sm:text-sm shadow-lg hover:bg-slate-100 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                    >
                      Aptitude Calculators
                    </button>
                    <button
                      onClick={() => setCurrentTab('formulas')}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                    >
                      Explore Formulas
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Statistics & Progress Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Calculations Done", value: totalCalculations, desc: "Queries resolved dynamically", icon: Calculator, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
                  { label: "Bookmarked & Favorites", value: favoriteCount, desc: "Key topics configured", icon: Star, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                  { label: "Practice Modules Status", value: "Active", desc: "Formulas Reference active", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "System Accuracy Rate", value: "100%", desc: "Precise decimal outputs", icon: History, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" }
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

              {/* Quick Search and Recommendation Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search 40+ calculators, formulas, or concepts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Topic Categories Grid */}
                  <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {[
                      { id: 'all', label: 'All Topics' },
                      { id: 'finance', label: 'Finance Math' },
                      { id: 'word-problems', label: 'Word Problems' },
                      { id: 'quantitative', label: 'Quantitative' },
                      { id: 'math-logic', label: 'Math Logic' },
                      { id: 'reasoning', label: 'Logical Reasoning' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-350'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Topic Cards List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTopics.length > 0 ? (
                      filteredTopics.map(topic => (
                        <div
                          key={topic.id}
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setCurrentTab('calculators');
                          }}
                          className="glass-card rounded-xl p-4 flex flex-col justify-between cursor-pointer border border-slate-200 dark:border-slate-800"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 capitalize">
                                {topic.category.replace('-', ' ')}
                              </span>
                              <button
                                onClick={(e) => toggleFavorite(topic.id, e)}
                                className="text-slate-400 hover:text-rose-500 transition"
                              >
                                <Star className={`w-4 h-4 ${favorites.includes(topic.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                            <h3 className="text-base font-bold mt-2 hover:text-violet-600 transition">{topic.name}</h3>
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
                            <div className="flex items-center text-xs font-semibold text-violet-600 hover:underline space-x-0.5">
                              <span>Solve</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm">No topics found matching your query.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar widgets */}
                <div className="space-y-6">
                  {/* Recently Used Calculations */}
                  <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-sm tracking-wide uppercase text-slate-400 mb-3 flex items-center space-x-1.5">
                      <History className="w-4 h-4 text-violet-500" />
                      <span>Recent Calculations</span>
                    </h3>
                    <div className="space-y-3">
                      {calcHistory.slice(0, 3).map((hist) => (
                        <div
                          key={hist.id}
                          onClick={() => {
                            setSelectedTopicId(hist.topicId);
                            setCurrentTab('calculators');
                          }}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-850/50 cursor-pointer hover:border-violet-400 transition"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs">{hist.topicName}</span>
                            <span className="text-[9px] text-slate-400">{hist.timestamp}</span>
                          </div>
                          <span className="block text-xs font-semibold text-violet-500 mt-1">{hist.result.answer}</span>
                        </div>
                      ))}
                      {calcHistory.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No computations logged yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Quick recommendation */}
                  <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20">
                    <h3 className="font-extrabold text-sm text-violet-750 dark:text-violet-400 flex items-center space-x-1.5">
                      <Star className="w-4 h-4 text-violet-500 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Topic Suggestion</span>
                    </h3>
                    <p className="text-xs text-slate-650 dark:text-slate-350 mt-1.5">
                      Try using the <strong>Permutations & Combinations</strong> calculator to quickly compute arrangements and selections.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTopicId("permutations-and-combinations");
                        setCurrentTab('calculators');
                      }}
                      className="mt-3 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-1.5 text-xs font-semibold transition"
                    >
                      Open Calculator
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CALCULATORS SCREEN */}
          {currentTab === 'calculators' && (
            <motion.div
              key="calculators"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Sidebar Selector */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wide">Aptitude Topics</h3>
                  <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                    {activeTopics.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                          selectedTopicId === topic.id
                            ? 'bg-violet-600 text-white shadow'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{topic.name}</span>
                        {favorites.includes(topic.id) && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0 ml-1.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Calculator Engine */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-bold">{activeTopic.name} Calculator</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeTopic.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(activeTopic.id)}
                      className={`mt-2 sm:mt-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        favorites.includes(activeTopic.id)
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${favorites.includes(activeTopic.id) ? 'fill-current' : ''}`} />
                      <span>{favorites.includes(activeTopic.id) ? 'Bookmarked' : 'Add to Favorites'}</span>
                    </button>
                  </div>

                  {/* Calculator Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {activeTopic.inputs.map(field => (
                      <div key={field.id} className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{field.name}</label>
                        {field.type === 'select' ? (
                          <select
                            value={calculatorInputs[field.id] || field.defaultValue}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs"
                          >
                            {(field.options || []).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={calculatorInputs[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none text-xs"
                            />
                            {field.unit && (
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {field.unit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={executeCalculation}
                    className="mt-6 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:from-violet-700 hover:to-indigo-700 transition"
                  >
                    Solve Problem
                  </button>
                </div>

                {/* Calculation Solution Engine Panel */}
                <AnimatePresence>
                  {calcResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/10 dark:to-transparent mb-6"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Step-by-Step Solution</h3>
                        <div className="flex space-x-1.5">
                          <button
                            onClick={() => copyToClipboard(calcResult.answer, "Solution answer copied!")}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-500 transition"
                            title="Copy Answer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => downloadReport(`${activeTopic.name} Solution`, `Result: ${calcResult.answer}\n\nSteps:\n${calcResult.steps.join("\n")}`)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-500 transition"
                            title="Download Report"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-violet-600/10 border border-violet-500/25">
                        <span className="block text-[10px] uppercase font-bold text-violet-500 tracking-wider">Final Output</span>
                        <span className="text-lg font-extrabold text-violet-700 dark:text-violet-300">{calcResult.answer}</span>
                      </div>

                      {calcResult.visualBreakdown && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                          {calcResult.visualBreakdown.map((item, idx) => (
                            <div key={idx} className="text-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                              <span className="block text-[9px] font-bold text-slate-400 uppercase">{item.label}</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 space-y-4">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Explanation Steps</span>
                        <div className="relative border-l-2 border-violet-550 dark:border-violet-800/80 ml-2.5 pl-4 space-y-4">
                          {calcResult.steps.map((step, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[25px] top-0.5 w-3.5 h-3.5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-violet-500/20">
                                {idx + 1}
                              </div>
                              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show Formulas reference immediately under calculator */}
                <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Formulas Reference</h3>
                  <div className="space-y-4">
                    {activeTopic.formulas.map((f, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50 relative group">
                        <button
                          onClick={() => copyToClipboard(f.formula, "Formula copied!")}
                          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-violet-500 transition"
                          title="Copy formula"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <span className="block text-xs font-bold text-violet-600 dark:text-violet-400">{f.name}</span>
                        <code className="block text-sm font-semibold mt-1 font-mono text-slate-800 dark:text-slate-200">{f.formula}</code>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FORMULAS REFERENCE BANK */}
          {currentTab === 'formulas' && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider">Cheat Sheet & Revision Bank</span>
                    <h2 className="text-2xl font-black mt-2">Aptitude Formula Bank</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore shortcuts, mathematical identities, and example derivations across all categories.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition rounded-xl text-xs font-bold"
                    >
                      <span>Print Sheet</span>
                    </button>
                    <button
                      onClick={() => downloadReport("Formula Sheet", activeTopics.map(t => `${t.name}:\n${t.formulas.map(f => `  - ${f.name}: ${f.formula}`).join("\n")}`).join("\n\n"))}
                      className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-violet-600 text-white hover:bg-violet-750 transition rounded-xl text-xs font-bold shadow-md shadow-violet-550/15"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Reference TXT</span>
                    </button>
                  </div>
                </div>

                {/* Revision Banner Info Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/10 to-indigo-650/10 border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-violet-700 dark:text-violet-400 flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Revision Mode Activated</span>
                    </h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-350">
                      Use the search filters to quickly lookup shortcuts before exams. Tap any formula expression to copy it instantly to your clipboard.
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    Formulas Count: 45+
                  </div>
                </div>

                {/* Formula Search & Category Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-450" />
                    <input
                      type="text"
                      placeholder="Search formulas, shortcuts, variable definitions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs font-semibold"
                    >
                      <option value="all">All Categories</option>
                      <option value="finance">Finance & Stocks</option>
                      <option value="word-problems">Time, Speed & Work</option>
                      <option value="quantitative">Mensuration & HCF</option>
                      <option value="math-logic">Advanced Algebra</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopics.map((topic) => (
                  <div key={topic.id} className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-base">{topic.name} Formulas</h3>
                        <span className="text-[10px] text-slate-400 capitalize">{topic.category.replace('-', ' ')}</span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(topic.id)}
                        className="text-slate-450 hover:text-amber-500 transition"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(topic.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {topic.formulas.map((f, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/50 relative group">
                          <button
                            onClick={() => copyToClipboard(f.formula, "Formula expression copied!")}
                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-violet-500 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <span className="block text-xs font-bold text-violet-600 dark:text-violet-400">{f.name}</span>
                          <code className="block text-sm font-semibold font-mono text-slate-800 dark:text-slate-100 mt-1">{f.formula}</code>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{f.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Solved Examples Accordion */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-3 flex flex-col justify-between h-full">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 mb-2">Solved Example:</h4>
                        {topic.examples.map((ex, idx) => (
                          <div key={idx} className="space-y-2 mb-3">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Q: {ex.question}</p>
                            <div className="space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 pl-3 py-0.5">
                              {ex.steps.map((s, sIdx) => (
                                <p key={sIdx} className="text-[10px] text-slate-500 dark:text-slate-400">{s}</p>
                              ))}
                            </div>
                            <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Answer: {ex.answer}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setCurrentTab('calculators');
                        }}
                        className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-650 text-white hover:from-violet-750 hover:to-indigo-700 transition rounded-xl text-xs font-bold shadow-md shadow-violet-550/10 flex items-center justify-center space-x-1.5"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Open & Calculate Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HISTORY & REPORT EXPORTS TAB */}
          {currentTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Calculation Log & Export Center</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Save formulas, print detailed worksheets, and download performance reports.</p>
                </div>
                {calcHistory.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCalcHistory([])}
                      className="flex items-center space-x-1 px-3 py-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition rounded-xl text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear History</span>
                    </button>
                    <button
                      onClick={() => downloadReport("History Logs", calcHistory.map(h => `[${h.timestamp}] ${h.topicName}\n  Inputs: ${JSON.stringify(h.inputs)}\n  Result: ${h.result.answer}`).join("\n\n"))}
                      className="flex items-center space-x-1 px-3 py-2 bg-violet-600 text-white transition rounded-xl text-xs font-semibold"
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
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
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
                          <button
                            onClick={() => {
                              setSelectedTopicId(hist.topicId);
                              setCalculatorInputs(Object.fromEntries(Object.entries(hist.inputs).map(([k, v]) => [k, String(v)])));
                              setCalcResult(hist.result);
                              setCurrentTab('calculators');
                            }}
                            className="text-violet-500 hover:underline text-[10px] font-bold"
                          >
                            Re-solve
                          </button>
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
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 bg-white dark:bg-slate-900/60 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-450 dark:text-slate-500 gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-slate-700 dark:text-slate-350">Aptitude Problem Solver &copy; 2026</p>
            <p className="mt-0.5">Designed with offline-first Progressive Web App capabilities.</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setCurrentTab('formulas')} className="hover:underline">Formula Sheets</button>
            <button onClick={() => setCurrentTab('calculators')} className="hover:underline">Calculators</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center space-x-0.5 hover:underline">
              <span>GitHub Code</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
