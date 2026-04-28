/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Sparkles, 
  History, 
  CheckCircle2, 
  Search, 
  Award, 
  Scan, 
  ChevronLeft,
  Heart,
  Droplets,
  Zap,
  ExternalLink,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import { PRODUCTS, QUIZ_QUESTIONS, Product } from './constants';

type Screen = 
  | 'home' 
  | 'quiz' 
  | 'result' 
  | 'products' 
  | 'quest-activation' 
  | 'quest-dashboard' 
  | 'check-in' 
  | 'rewards';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [missionResult, setMissionResult] = useState<Product | null>(null);
  const [isQuestActivated, setIsQuestActivated] = useState(false);
  const [questCode, setQuestCode] = useState('');
  const [routineProgress, setRoutineProgress] = useState(8);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // Navigation Helper
  const navigate = (screen: Screen) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  // Quiz Logic
  const handleQuizAnswer = (questionId: number, value: string, missionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length - 1) {
      const result = PRODUCTS.find(p => p.id === missionId) || PRODUCTS[0];
      setMissionResult(result);
      setTimeout(() => navigate('result'), 500);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    navigate('quiz');
  };

  // Quest Logic
  const handleActivateQuest = () => {
    if (questCode.length === 4) {
      setIsQuestActivated(true);
      navigate('quest-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sunsilk-blush font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
          <div className="w-9 h-9 rounded-full gradient-magenta flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sunsilk-magenta/20 tracking-tighter">S</div>
          <h1 className="text-xl font-black text-sunsilk-magenta tracking-tight italic uppercase">
            SUNSILK <span className="text-sunsilk-blue not-italic font-black">MISSION HUB</span>
          </h1>
        </div>
        <div className="hidden sm:block text-[10px] font-black text-sunsilk-blue uppercase tracking-[0.2em] border-b-2 border-sunsilk-blue pb-1">
          Gen Z Hair Portfolio
        </div>
        <button onClick={() => navigate('products')} className="p-2 text-sunsilk-blue hover:scale-110 transition-transform">
          <Search size={22} />
        </button>
      </header>

      <main className="pt-24 pb-28 px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen key="home" navigate={navigate} isQuestActivated={isQuestActivated} />
          )}
          {currentScreen === 'quiz' && (
            <QuizScreen key="quiz" navigate={navigate} quizAnswers={quizAnswers} onAnswer={handleQuizAnswer} />
          )}
          {currentScreen === 'result' && (
            <ResultScreen key="result" product={missionResult} navigate={navigate} onRestart={resetQuiz} />
          )}
          {currentScreen === 'products' && (
            <ProductsScreen key="products" navigate={navigate} />
          )}
          {currentScreen === 'quest-activation' && (
            <ActivationScreen 
              key="activation" 
              navigate={navigate} 
              code={questCode} 
              onCodeChange={setQuestCode} 
              onActivate={handleActivateQuest} 
            />
          )}
          {currentScreen === 'quest-dashboard' && (
            <DashboardScreen 
              key="dashboard" 
              progress={routineProgress} 
              navigate={navigate} 
              isCheckInToday={lastCheckIn === new Date().toISOString().split('T')[0]} 
            />
          )}
          {currentScreen === 'check-in' && (
            <CheckInScreen 
              key="checkin" 
              navigate={navigate} 
              onComplete={() => {
                setRoutineProgress(p => p + 1);
                setLastCheckIn(new Date().toISOString().split('T')[0]);
                navigate('quest-dashboard');
              }} 
            />
          )}
          {currentScreen === 'rewards' && (
            <RewardsScreen key="rewards" navigate={navigate} />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white/20 flex items-center justify-around py-4 px-6 z-50 shadow-2xl rounded-[2.5rem] max-w-md mx-auto">
        <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'home' ? 'text-sunsilk-magenta scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <Droplets size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Discover</span>
        </button>
        <button onClick={() => navigate('products')} className={`flex flex-col items-center gap-1 transition-all ${currentScreen === 'products' ? 'text-sunsilk-magenta scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <Sparkles size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Portfolio</span>
        </button>
        <button 
          onClick={() => isQuestActivated ? navigate('quest-dashboard') : navigate('quest-activation')} 
          className={`flex flex-col items-center gap-1 transition-all ${['quest-dashboard', 'quest-activation', 'check-in', 'rewards'].includes(currentScreen) ? 'text-sunsilk-magenta scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Award size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Quest</span>
        </button>
      </nav>
    </div>
  );
}

// --- SCREEN COMPONENTS ---

interface ScreenProps {
  navigate: (screen: Screen) => void;
  key?: React.Key;
}

function HomeScreen({ navigate, isQuestActivated }: ScreenProps & { isQuestActivated: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
      <section className="relative overflow-hidden rounded-[3rem] bg-white p-8 space-y-6 shadow-2xl shadow-sunsilk-magenta/10 border border-white/30">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-sunsilk-pink/20 rounded-full blur-3xl opacity-50" />
        <div className="relative">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sunsilk-magenta/10 text-sunsilk-magenta text-[9px] font-black uppercase tracking-widest mb-4">Hello, Silky Girl!</span>
          <h1 className="text-4xl font-black text-sunsilk-blue leading-[1.05] tracking-tight">
            Find your <br />
            <span className="text-sunsilk-magenta italic">Perfect Hair</span> <br />
            Mission.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed font-medium mt-4 max-w-[240px]">
            The digital hub for your tailored routine and exclusive rewards.
          </p>

          <div className="pt-8 flex flex-col gap-4">
            <button 
              onClick={() => navigate('quiz')}
              className="group w-full h-16 gradient-magenta rounded-2xl flex items-center justify-between px-6 text-white font-black shadow-xl shadow-sunsilk-magenta/30 transition-all active:scale-[0.98] hover:-translate-y-1"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">30-Sec Hair Rescue</span>
                <span className="text-lg">Start Quiz</span>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button 
              onClick={() => isQuestActivated ? navigate('quest-dashboard') : navigate('quest-activation')}
              className="group w-full h-16 bg-sunsilk-blue rounded-2xl flex items-center justify-between px-6 text-white font-black shadow-xl shadow-sunsilk-blue/30 transition-all active:scale-[0.98] hover:-translate-y-1"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Silky Side Quest</span>
                <span className="text-lg">Enter Code</span>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-black italic tracking-tighter text-sunsilk-blue">Our Missions.</h2>
          <button className="text-sunsilk-magenta text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Browse All</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Root Rescue', icon: '🌱', color: 'bg-white' },
            { label: 'Scalp Comfort', icon: '❄️', color: 'bg-white' },
            { label: 'Damage Repair', icon: '✨', color: 'bg-white' },
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-5 rounded-[2.5rem] flex flex-col items-center gap-3 text-center border border-white shadow-lg shadow-sunsilk-blue/5 transition-all hover:scale-105 cursor-pointer`}>
              <div className="text-3xl filter drop-shadow-sm mb-1">{item.icon}</div>
              <span className="text-[9px] font-black leading-tight uppercase tracking-widest opacity-90 text-sunsilk-blue">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sunsilk-blue p-8 rounded-[3rem] space-y-5 shadow-2xl shadow-sunsilk-blue/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <h2 className="text-xl font-black tracking-tight text-white italic">Already bought <br />Treatment?</h2>
        <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md p-6 rounded-3xl cursor-pointer hover:bg-white/15 transition-colors border border-white/10" onClick={() => navigate('quest-activation')}>
          <div className="w-14 h-14 rounded-2xl bg-sunsilk-yellow flex items-center justify-center text-sunsilk-blue shadow-lg shadow-sunsilk-yellow/20">
            <Scan size={28} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-white/90 leading-relaxed italic">Log your mission & unlock personalized rewards instantly.</p>
          </div>
          <ChevronRight size={24} className="text-sunsilk-yellow" />
        </div>
      </section>
    </motion.div>
  );
}

function QuizScreen({ navigate, quizAnswers, onAnswer }: ScreenProps & { quizAnswers: Record<number, string>, onAnswer: (questionId: number, value: string, missionId: string) => void }) {
  const currentQIndex = Object.keys(quizAnswers).length;
  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  if (!currentQ) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('home')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"><ChevronLeft /></button>
          <div className="flex gap-1.5">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i <= currentQIndex ? 'w-8 bg-sunsilk-magenta' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          <div className="w-10" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-sunsilk-magenta uppercase tracking-[0.2em]">Hair Rescue Quiz</span>
          <h2 className="text-2xl font-black text-gray-900 leading-[1.2]">{currentQ.question}</h2>
        </div>
      </div>

      <div className="grid gap-3 pt-4">
        {currentQ.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(currentQ.id, option.value, option.missionId)}
            className="w-full p-6 text-left glass-card hover:bg-white border-transparent hover:border-sunsilk-magenta/30 group transition-all duration-300 shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700 group-hover:text-sunsilk-magenta leading-tight transition-colors">{option.label}</span>
              <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-sunsilk-magenta flex items-center justify-center transition-colors">
                <div className="w-3 h-3 rounded-full bg-sunsilk-magenta scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ResultScreen({ product, navigate, onRestart }: ScreenProps & { product: Product | null, onRestart: () => void }) {
  if (!product) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10 pb-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunsilk-pink/10 border border-sunsilk-pink/20 mb-2">
          <Star className="text-sunsilk-yellow fill-sunsilk-yellow" size={14} />
          <span className="text-[10px] font-black text-sunsilk-magenta uppercase tracking-[0.2em]">Mission Revealed</span>
        </div>
        <h2 className="text-4xl font-black text-sunsilk-blue tracking-tighter leading-none italic px-4">Your Match.</h2>
      </div>

      <div className="relative flex justify-center mb-4">
        <div className="w-48 h-48 rounded-full bg-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 animate-pulse" />
        <div className="w-64 h-64 rounded-full bg-sunsilk-magenta/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 scale-150" />
        
        <div className={`w-48 aspect-[3/4] rounded-[3rem] ${product.color === 'magenta' ? 'gradient-magenta' : 'gradient-blue'} p-1 relative z-10 shadow-2xl transform hover:rotate-2 transition-transform duration-500`}>
          <div className="w-full h-full rounded-[2.8rem] border-4 border-white/20 overflow-hidden flex flex-col items-center justify-center space-y-4 p-6 relative">
            <div className="absolute top-0 left-0 w-full p-4 text-center">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Premium Care</span>
            </div>
            <Droplets size={48} className="text-white/30" strokeWidth={1} />
            <h3 className="text-white font-black text-center text-xl leading-tight uppercase tracking-tight">{product.name}</h3>
            <div className="w-8 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[3rem] border border-white shadow-xl shadow-sunsilk-magenta/5 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-sunsilk-magenta uppercase tracking-widest block">The Science</span>
            <h4 className="text-xl font-black text-sunsilk-blue italic tracking-tighter leading-none">{product.hairProblem}.</h4>
            <p className="text-sm font-medium text-gray-500 leading-relaxed italic mt-2">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Complex</p>
              <p className="text-xs font-black text-sunsilk-blue">{product.ingredient}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Benefit</p>
              <p className="text-xs font-black text-sunsilk-magenta">{product.benefit}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <button className="w-full h-18 bg-[#ee4d2d] rounded-2xl flex items-center justify-center gap-3 text-white font-black shadow-xl shadow-sunsilk-orange/30 active:scale-95 transition-all text-sm uppercase tracking-widest">
            Buy on Shopee
            <ExternalLink size={18} />
          </button>
          <button 
            onClick={() => navigate('quest-activation')}
            className="w-full h-18 bg-sunsilk-blue rounded-2xl flex items-center justify-center gap-3 text-white font-black shadow-xl shadow-sunsilk-blue/30 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Activate Mission Quest
            <Zap size={18} className="text-sunsilk-yellow fill-sunsilk-yellow" />
          </button>
          <button onClick={onRestart} className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-sunsilk-magenta transition-colors">Retake Hair Rescue Quiz</button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductsScreen({ navigate }: ScreenProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight leading-none text-gray-900">Expert <br /><span className="text-sunsilk-magenta">Portfolio.</span></h2>
        <p className="text-gray-500 text-sm font-medium">Compare and find your ultimate hair rescue formula.</p>
      </div>

      <div className="space-y-8">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 p-6 space-y-6 transition-all hover:shadow-xl hover:shadow-sunsilk-magenta/5">
            <div className={`w-full aspect-[4/3] rounded-3xl ${p.color === 'magenta' ? 'bg-sunsilk-blush' : 'bg-sunsilk-mist'} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}>
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <div className="relative">
                  <div className={`w-20 h-40 ${p.color === 'magenta' ? 'bg-sunsilk-magenta shadow-sunsilk-magenta/30' : 'bg-sunsilk-blue shadow-sunsilk-blue/30'} rounded-t-2xl rounded-b-lg shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500`} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full text-center text-white font-black text-[10px] uppercase tracking-tighter px-2 leading-none">CICA CARE</div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Droplets size={14} className="text-white" />
                  </div>
               </div>
            </div>
            
            <div className="space-y-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${p.color === 'magenta' ? 'text-sunsilk-magenta' : 'text-sunsilk-blue'}`}>{p.hairProblem}</span>
              <h3 className="text-2xl font-black leading-none tracking-tight">{p.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6 py-5 border-y border-gray-50">
               <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Recommended Use</span>
                  <span className="text-xs font-black block">{p.usage}</span>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Complex</span>
                  <span className="text-xs font-black block">{p.ingredient}</span>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium italic pr-4 leading-relaxed">"{p.description}"</p>
              </div>
              <button className={`w-10 h-10 rounded-full ${p.color === 'magenta' ? 'bg-sunsilk-magenta' : 'bg-sunsilk-blue'} text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform`}>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ActivationScreen({ navigate, code, onCodeChange, onActivate }: ScreenProps & { code: string, onCodeChange: (v: string) => void, onActivate: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center pt-8">
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-sunsilk-magenta mx-auto shadow-xl ring-8 ring-sunsilk-blush">
          <Scan size={40} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sunsilk-yellow rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
          <Star size={16} fill="currentColor" />
        </div>
      </div>
      
      <div className="space-y-3 px-4">
        <h2 className="text-3xl font-black tracking-tight leading-none">Activate Quest</h2>
        <p className="text-sm font-medium text-gray-500 leading-relaxed italic pr-4">Find the 4-digit code under the bottle seal to unlock exclusive rewards.</p>
      </div>

      <div className="relative group">
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-14 h-20 bg-white rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-3xl font-black ${code.length === i ? 'border-sunsilk-magenta ring-4 ring-sunsilk-magenta/5 scale-105' : 'border-gray-50 text-sunsilk-magenta'}`}>
              {code[i] || ''}
            </div>
          ))}
        </div>

        <input 
          type="tel" 
          maxLength={4} 
          value={code} 
          onChange={(e) => onCodeChange(e.target.value)}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
          autoFocus
        />
      </div>

      <div className="space-y-6 px-2">
        <button 
          onClick={onActivate}
          disabled={code.length !== 4}
          className={`w-full h-18 rounded-[1.5rem] font-black text-lg transition-all duration-300 shadow-xl ${code.length === 4 ? 'gradient-magenta text-white active:scale-95 shadow-sunsilk-magenta/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
        >
          Check Code & Activate
        </button>
        <div className="flex flex-col items-center gap-1 opacity-60">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Where is my code?</p>
           <button className="text-[10px] font-black text-sunsilk-magenta underline underline-offset-4 uppercase tracking-widest">Show me guide</button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] text-left shadow-sm border border-gray-100 space-y-6">
        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-sunsilk-magenta border-b border-sunsilk-blush pb-4">The Journey Layout</h4>
        <div className="space-y-6">
          {[
            { t: 'Scan & Unlock', d: 'Enter code to verify your purchase instantly.', i: <Scan size={18} /> },
            { t: 'Routine Streak', d: 'Log your usage daily for 30 days to build the habit.', i: <Calendar size={18} /> },
            { t: 'Claim Vouchers', d: 'Milestone rewards waiting for you at Day 7, 14, 21, and 30.', i: <Award size={18} /> },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-sunsilk-blush text-sunsilk-magenta flex-shrink-0 flex items-center justify-center shadow-sm">
                {item.i}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black tracking-tight">{item.t}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ progress, navigate, isCheckInToday }: ScreenProps & { progress: number, isCheckInToday: boolean }) {
  const currentLevel = Math.floor(progress / 10) + 1;
  const progressPercent = ((progress % 30) / 30) * 100;
  const circleCircumference = 2 * Math.PI * 46; // r=46
  const strokeDashoffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-32">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter leading-none italic text-sunsilk-blue">Silky Side Quest.</h2>
          <p className="text-[10px] text-sunsilk-magenta font-black uppercase tracking-[0.2em] mt-2">Mission: Root Rescue • Lvl {currentLevel}</p>
        </div>
        <div className="relative group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl border border-white rotate-3 group-hover:rotate-0 transition-all duration-500">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=hairs&backgroundColor=ec77ae`} className="rounded-xl w-full h-full bg-sunsilk-blush" alt="Profile" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-sunsilk-yellow rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black shadow-md">ID</div>
        </div>
      </div>

      <section className="bg-sunsilk-blue p-10 rounded-[3.5rem] text-white shadow-2xl shadow-sunsilk-blue/40 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative mb-8 flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
            <motion.circle 
              initial={{ strokeDashoffset: circleCircumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="80" cy="80" r="70" 
              stroke="#ffd24a" strokeWidth="12" fill="none" 
              strokeDasharray={circleCircumference}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight">{progress.toString().padStart(2, '0')}</span>
              <span className="text-sm font-black opacity-40">/30</span>
            </div>
            <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Routine Days</span>
          </div>
        </div>

        <div className="w-full space-y-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-sunsilk-orange/20 flex items-center justify-center text-sunsilk-orange border border-sunsilk-orange/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd24a]">Current Task</span>
                <span className="text-[10px] font-bold text-white/50">+50 PTS</span>
              </div>
              <p className="text-xs font-bold leading-none mb-1">Apply Cica Root Tonic</p>
              <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">Massage scalp for 1 min after wash</p>
            </div>
          </div>

          <button 
            onClick={() => !isCheckInToday && navigate('check-in')}
            disabled={isCheckInToday}
            className={`w-full h-18 rounded-[1.5rem] font-black text-lg shadow-2xl transition-all duration-500 uppercase tracking-widest ${isCheckInToday ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-sunsilk-blue active:scale-95 shadow-white/10 ring-4 ring-white/5'}`}
          >
            {isCheckInToday ? 'Routine Logged' : 'Log Daily Progress'}
          </button>
        </div>

        <div className="mt-8 flex justify-between w-full px-2">
            <div className="text-left">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Rewards Status</p>
              <p className="text-xs font-bold">20% Shopee Voucher</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Coming In</p>
              <p className="text-xs font-bold text-sunsilk-yellow">{7 - (progress % 7)} Days</p>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('rewards')}
          className="bg-white p-7 rounded-[3rem] shadow-xl shadow-sunsilk-magenta/5 border border-white flex flex-col items-center gap-5 text-center group active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-[1.5rem] bg-sunsilk-blush flex items-center justify-center text-sunsilk-magenta shadow-inner group-hover:rotate-12 transition-transform">
            <Award size={28} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Unlocked</p>
            <p className="text-sm font-black text-sunsilk-blue tracking-tight">3 Vouchers</p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-[3rem] shadow-xl shadow-sunsilk-magenta/5 border border-white flex flex-col items-center gap-5 text-center group active:scale-95 transition-all cursor-pointer">
          <div className="w-14 h-14 rounded-[1.5rem] bg-sunsilk-mist flex items-center justify-center text-sunsilk-blue shadow-inner group-hover:rotate-12 transition-transform">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Points</p>
            <p className="text-sm font-black text-sunsilk-blue tracking-tight">1,250 PTS</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckInScreen({ onComplete, navigate }: ScreenProps & { onComplete: () => void }) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const feelings = [
    { id: 'fresh', emoji: '🫧', label: 'Fresh & Airy' },
    { id: 'cool', emoji: '❄️', label: 'Icy Cool' },
    { id: 'smooth', emoji: '✨', label: 'Instant Silk' },
    { id: 'strong', emoji: '💪', label: 'Strong Roots' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 pt-8 text-center pb-12">
      <div className="space-y-3">
        <div className="w-20 h-20 bg-sunsilk-blush rounded-full flex items-center justify-center text-sunsilk-magenta mx-auto shadow-inner relative">
           <Heart size={32} fill="currentColor" />
           <div className="absolute -top-1 -right-1 w-8 h-8 bg-sunsilk-yellow rounded-full border-2 border-white flex items-center justify-center text-white">+50</div>
        </div>
        <h2 className="text-2xl font-black tracking-tight leading-none">Mission Accomplished!</h2>
        <p className="text-sm font-medium text-gray-500 px-8 italic leading-relaxed">Describe the sensation after your daily Sunsilk rescue ritual.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {feelings.map((f) => (
          <button 
            key={f.id}
            onClick={() => setSelectedFeeling(f.id)}
            className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${selectedFeeling === f.id ? 'border-sunsilk-magenta bg-white shadow-xl shadow-sunsilk-magenta/10 ring-8 ring-sunsilk-blush' : 'border-gray-50 bg-white shadow-sm'}`}
          >
            <span className="text-4xl filter drop-shadow-sm">{f.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-tight">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-widest">
          <span className="text-gray-400">XP Earned today</span>
          <span className="text-sunsilk-magenta">+120 XP</span>
        </div>
        <div className="w-full h-1 bg-gray-50 rounded-full" />
        <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-widest">
           <span className="text-gray-400">Streak Progress</span>
           <span className="text-sunsilk-blue">+1 Day</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={onComplete}
          disabled={!selectedFeeling}
          className={`w-full h-18 rounded-[1.5rem] font-black text-lg transition-all duration-500 shadow-xl ${selectedFeeling ? 'gradient-magenta text-white active:scale-95 shadow-sunsilk-magenta/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
        >
          Post Check-In & Earn XP
        </button>
        <button onClick={() => navigate('quest-dashboard')} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] py-3 hover:text-sunsilk-magenta transition-colors">Skip logging feeling</button>
      </div>
    </motion.div>
  );
}

function RewardsScreen({ navigate }: ScreenProps) {
  const rewards = [
    { day: 7, title: 'Novice Rescuer', gift: 'Sunsilk E-Commerce Voucher 30%', unlocked: true, icon: <Sparkles size={20} /> },
    { day: 14, title: 'Silky Enthusiast', gift: 'Free Head Spa @ Partner Salon', unlocked: false, icon: <MapPin size={20} /> },
    { day: 21, title: 'Mission Veteran', gift: 'Bonus Mini Product Bundle', unlocked: false, icon: <Heart size={20} /> },
    { day: 30, title: 'Hair Master', gift: '60% Gold Voucher & Legend Badge', unlocked: false, icon: <Award size={20} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md sticky top-16 -mx-6 px-6 py-4 z-40 border-b border-gray-100">
        <button onClick={() => navigate('quest-dashboard')} className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 active:scale-90 transition-transform"><ChevronLeft size={20} /></button>
        <h2 className="text-2xl font-black tracking-tight leading-none">Your Rewards.</h2>
      </div>

      <div className="relative space-y-10 pl-12 before:content-[''] before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-1.5 before:bg-white before:rounded-full before:shadow-inner">
        {rewards.map((r, i) => (
          <div key={i} className="relative group">
            <div className={`absolute -left-12 w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-4 border-white shadow-xl z-10 transition-all duration-500 ${r.unlocked ? 'bg-sunsilk-magenta text-white scale-110 shadow-sunsilk-magenta/30' : 'bg-gray-100 text-gray-300'}`}>
              {r.unlocked ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className="text-[10px] font-black">{r.day}</div>}
            </div>
            <div className={`p-8 rounded-[3rem] shadow-sm border transition-all duration-500 scale-100 ${r.unlocked ? 'bg-white border-sunsilk-magenta/10 ring-8 ring-sunsilk-blush/30 group-hover:scale-[1.02]' : 'bg-white/50 border-gray-50 opacity-60'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${r.unlocked ? 'text-sunsilk-magenta' : 'text-gray-400'}`}>Milestone • Day {r.day}</span>
                {r.unlocked && <div className="w-8 h-8 rounded-full bg-sunsilk-blush flex items-center justify-center text-sunsilk-magenta animate-bounce">
                  <Star size={14} fill="currentColor" />
                </div>}
              </div>
              <h3 className="font-black text-xl mb-1 tracking-tight">{r.title}</h3>
              <div className="flex items-start gap-3 mb-6">
                <div className="py-1 text-sunsilk-blue">{r.icon}</div>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">{r.gift}</p>
              </div>
              
              <button 
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${r.unlocked ? 'bg-sunsilk-magenta text-white active:scale-95 shadow-lg shadow-sunsilk-magenta/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {r.unlocked ? 'Claim Now' : `Reach Day ${r.day}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-tr from-sunsilk-blue to-sunsilk-blue/80 p-10 rounded-[3.5rem] text-white space-y-6 text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
         <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto ring-8 ring-white/5">
            <Heart size={32} fill="#ec77ae" className="text-sunsilk-pink" />
         </div>
         <div className="space-y-2">
            <h4 className="font-black text-xl tracking-tight leading-none uppercase">Premium Partner Exclusive</h4>
            <p className="text-xs font-bold leading-relaxed px-2 text-sunsilk-mist opacity-80 italic">Successfully completing the 30-day mission unlocks a personalized head spa consultation at our partner salon!</p>
         </div>
         <button className="px-8 py-3 bg-white text-sunsilk-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-sunsilk-yellow hover:text-white transition-all shadow-xl">Browse Partners</button>
      </section>
    </motion.div>
  );
}
