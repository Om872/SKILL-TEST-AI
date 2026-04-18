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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Master Your Skills
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">With AI-Powered Tests</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Challenge yourself with dynamic, AI-generated questions tailored to your skill level. 
          Get instant feedback, detailed analytics, and track your progress.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 space-y-8"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            1. Select a Skill
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SKILLS.map((skill) => (
              <button
                key={skill.id}
                onClick={() => { setSelectedSkill(skill.id); setCustomSkill(''); }}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group
                  ${selectedSkill === skill.id && !customSkill
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
                    : 'border-transparent bg-gray-50 dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
              >
                <div className={`p-3 rounded-xl mb-3 ${skill.bg}`}>
                  <skill.icon className={`h-8 w-8 ${skill.color}`} />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full relative">
              <input
                type="text"
                placeholder="Or type any skill (e.g. Node.js, C++, Marketing)"
                value={customSkill}
                onChange={(e) => { setCustomSkill(e.target.value); setSelectedSkill(''); }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            2. Choose Difficulty
          </h2>
          <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl w-max">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleStartTest}
            disabled={!selectedSkill && !customSkill.trim()}
            className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-indigo-500/25
              ${(selectedSkill || customSkill.trim()) 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-[1.02]' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            <span>Start Assessment</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
