import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, History, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/user-history');
        setHistory(response.data.history);
      } catch (err) {
        setError('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Calculate stats
  const totalTests = history.length;
  const avgScore = totalTests > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests)
    : 0;
  const bestSkill = totalTests > 0
    ? history.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current).skill
    : 'None';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 relative z-10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="mb-10 text-center md:text-left relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight">Your Dashboard</h1>
        <p className="text-indigo-200 text-lg">Track your progress and performance analytics in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-[0_10px_40px_rgba(99,102,241,0.3)] border border-white/20"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-indigo-100 font-medium text-lg">Average Score</h3>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10"><Target className="h-6 w-6" /></div>
          </div>
          <div className="text-6xl font-black tracking-tight drop-shadow-md relative z-10">{avgScore}%</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-gray-400 text-lg">Tests Taken</h3>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <History className="h-6 w-6 drop-shadow-[0_0_8px_currentColor]" />
            </div>
          </div>
          <div className="text-6xl font-black text-white tracking-tight drop-shadow-md">{totalTests}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-gray-400 text-lg">Best Skill</h3>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy className="h-6 w-6 drop-shadow-[0_0_8px_currentColor]" />
            </div>
          </div>
          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 capitalize truncate drop-shadow-md pb-1">{bestSkill}</div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl shadow-xl overflow-hidden relative z-10"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-bold text-white tracking-wide">Recent Assessments</h2>
          <button 
            onClick={() => navigate('/')}
            className="group px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-300 hover:text-indigo-200 font-semibold text-sm flex items-center transition-all duration-300"
          >
            Take New Test <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {history.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <div className="inline-flex p-6 rounded-full bg-white/5 mb-4">
              <History className="h-12 w-12 text-gray-500" />
            </div>
            <p className="text-lg">You haven't taken any tests yet.</p>
            <p className="text-sm mt-2 text-gray-500">Head to the home page to start your first premium assessment!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-gray-400 text-sm tracking-wider uppercase">
                <tr>
                  <th className="px-8 py-5 font-semibold">Skill</th>
                  <th className="px-8 py-5 font-semibold">Difficulty</th>
                  <th className="px-8 py-5 font-semibold">Score</th>
                  <th className="px-8 py-5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 font-semibold text-white capitalize flex items-center shadow-none">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-4 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                        {item.skill.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-lg">{item.skill}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs font-semibold tracking-wide text-gray-300 capitalize shadow-sm">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className={`text-xl font-black mr-3 drop-shadow-sm ${item.percentage >= 80 ? 'text-green-400' : item.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {item.percentage}%
                        </span>
                        <span className="text-gray-500 text-sm font-medium bg-black/30 px-2 py-0.5 rounded-md">({item.score}/{item.total_questions})</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-medium">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
