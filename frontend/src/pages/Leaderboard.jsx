import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import api from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data.leaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 inline-flex items-center">
          <Trophy className="w-10 h-10 mr-3 text-amber-500" />
          Global Leaderboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Top performers across all skills</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Rank</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Skill</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Score</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">%</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No tests taken yet. Be the first!</td>
                </tr>
              ) : (
                leaderboard.map((entry, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="p-4">
                      {idx === 0 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
                       idx === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                       idx === 2 ? <Award className="w-6 h-6 text-amber-700" /> :
                       <span className="font-bold text-gray-500 ml-2">#{idx + 1}</span>}
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white capitalize">{entry.user}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 capitalize">
                        {entry.skill} • {entry.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{entry.score}/{entry.total_questions}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        entry.percentage >= 80 ? 'text-green-500' :
                        entry.percentage >= 50 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {entry.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
