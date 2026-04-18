import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Activity, Trophy } from 'lucide-react';
import api from '../services/api';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get('/profile'),
          api.get('/user-history')
        ]);
        setProfile(profileRes.data);
        setHistory(historyRes.data.history);
      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-10 text-red-500">Failed to load profile.</div>;
  }

  const totalTests = history.length;
  const averageScore = totalTests > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests) 
    : 0;

  // Process data for Radar chart
  const skillAverages = history.reduce((acc, curr) => {
    const skill = curr.skill.charAt(0).toUpperCase() + curr.skill.slice(1);
    if (!acc[skill]) {
      acc[skill] = { total: 0, count: 0 };
    }
    acc[skill].total += curr.percentage;
    acc[skill].count += 1;
    return acc;
  }, {});

  const radarLabels = Object.keys(skillAverages);
  const radarDataPoints = radarLabels.map(skill => Math.round(skillAverages[skill].total / skillAverages[skill].count));

  const radarData = {
    labels: radarLabels.length > 0 ? radarLabels : ['No Data yet'],
    datasets: [
      {
        label: 'Skill Proficiency (%)',
        data: radarLabels.length > 0 ? radarDataPoints : [0],
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(156, 163, 175, 0.2)' },
        grid: { color: 'rgba(156, 163, 175, 0.2)' },
        pointLabels: { color: 'rgba(107, 114, 128, 1)', font: { size: 14, family: 'Inter' } },
        ticks: { backdropColor: 'transparent', color: 'rgba(107, 114, 128, 0.8)', max: 100, min: 0, stepSize: 20 }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white dark:bg-gray-700 p-2 rounded-2xl shadow-lg border-4 border-white dark:border-gray-800">
              <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                {profile.name}
              </h1>
              <div className="flex items-center space-x-2 mt-2 text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.joined_at}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Total Tests</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTests}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Avg Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore}%</p>
              </div>
            </div>
            
            {/* Skill Radar Chart Details  */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skill Analytics</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 h-80 flex items-center justify-center">
                 {totalTests > 0 ? (
                    <Radar data={radarData} options={radarOptions} />
                 ) : (
                    <p className="text-gray-500 italic">Take some tests to see your skill chart!</p>
                 )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
