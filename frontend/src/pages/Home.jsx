import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Database, Terminal, Sparkles, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';

const SKILLS = [
  { id: 'python', name: 'Python', icon: Terminal, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'java', name: 'Java', icon: Database, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'react', name: 'React', icon: Code2, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'data-science', name: 'Data Science', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' }
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const Home = () => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const navigate = useNavigate();

  const handleStartTest = () => {
    const finalSkill = customSkill.trim() || selectedSkill;
    if (!finalSkill) return;
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/quiz?skill=${encodeURIComponent(finalSkill)}&difficulty=${difficulty.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 relative overflow-hidden">
      {/* Animated Glowing Orbs Behind */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-center max-w-4xl mb-16 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-border bg-white/5 mb-8"
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-200">Next-Gen Assessment Engine</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Master Your Skills
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            With AI-Powered Tests
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
          Challenge yourself with dynamic, AI-generated questions tailored to your skill level. 
          Get instant feedback, detailed analytics, and track your progress in real-time.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-4xl glass-card rounded-3xl p-8 md:p-12 space-y-10 relative z-10"
      >
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-8 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase text-sm">
              1. Select a Skill
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SKILLS.map((skill, index) => (
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                key={skill.id}
                onClick={() => { setSelectedSkill(skill.id); setCustomSkill(''); }}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden group
                  ${selectedSkill === skill.id && !customSkill
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_25px_rgba(99,102,241,0.3)]' 
                    : 'border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'}`}
              >
                {selectedSkill === skill.id && !customSkill && (
                  <motion.div 
                    layoutId="outline"
                    className="absolute inset-0 border-2 border-indigo-400 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`p-4 rounded-xl mb-3 transition-transform duration-300 group-hover:scale-110 shadow-lg ${skill.bg} ${selectedSkill === skill.id ? 'shadow-'+skill.color.split('-')[1]+'-500/50' : ''}`}>
                  <skill.icon className={`h-8 w-8 ${skill.color} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{skill.name}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Code2 className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Or type any skill (e.g. Node.js, Next.js, Marketing, SQL)"
                value={customSkill}
                onChange={(e) => { setCustomSkill(e.target.value); setSelectedSkill(''); }}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all shadow-inner backdrop-blur-sm hover:bg-white/10"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-8 w-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase text-sm">
              2. Choose Difficulty
            </h2>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-2xl w-max border border-white/10 backdrop-blur-md relative">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 z-10
                  ${difficulty === level
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {difficulty === level && (
                  <motion.div
                    layoutId="diff-selector"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 border border-white/20 rounded-xl -z-10 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 flex justify-end border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTest}
            disabled={!selectedSkill && !customSkill.trim()}
            className={`relative overflow-hidden group flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl text-lg font-bold transition-all
              ${(selectedSkill || customSkill.trim()) 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] cursor-pointer' 
                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'}`}
          >
            {/* Glossy overlay effect */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <span className="relative z-10 tracking-wide">Initialize Assessment</span>
            <ChevronRight className="relative z-10 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
