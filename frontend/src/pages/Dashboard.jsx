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
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your progress and performance analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-indigo-100 font-medium">Average Score</h3>
            <div className="p-2 bg-white/20 rounded-xl"><Target className="h-6 w-6" /></div>
          </div>
          <div className="text-4xl font-bold">{avgScore}%</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 text-gray-900 dark:text-white">
            <h3 className="font-medium text-gray-500 dark:text-gray-400">Tests Taken</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <History className="h-6 w-6" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 dark:text-white">{totalTests}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 text-gray-900 dark:text-white">
            <h3 className="font-medium text-gray-500 dark:text-gray-400">Best Skill</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 dark:text-white capitalize">{bestSkill}</div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Assessments</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm flex items-center"
          >
            Take New Test <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            You haven't taken any tests yet. Head to the home page to start your first assessment!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Skill</th>
                  <th className="px-6 py-4 font-medium">Difficulty</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white capitalize flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600">
                        {item.skill.charAt(0).toUpperCase()}
                      </div>
                      {item.skill}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`font-bold mr-2 ${item.percentage >= 80 ? 'text-green-500' : item.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {item.percentage}%
                        </span>
                        <span className="text-gray-400 text-sm">({item.score}/{item.total_questions})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
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
