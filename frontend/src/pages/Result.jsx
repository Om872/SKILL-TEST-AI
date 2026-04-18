import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw, LayoutDashboard, Download } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  const { score, total, questions, answers, skill, difficulty } = location.state;
  const percentage = Math.round((score / total) * 100);
  const wrongCount = total - score;

  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [score, wrongCount],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const processScoreColor = (p) => {
    if (p >= 80) return 'text-green-500';
    if (p >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleExportPDF = () => {
    // Native print opens browser Print to PDF dialogue, 
    // and layout is handled perfectly via print:hidden utility classes
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div id="report-container" className="space-y-8">
      {/* Header and Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Test Completed!</h1>
          <p className="text-indigo-100 text-lg">
            {skill.charAt(0).toUpperCase() + skill.slice(1)} • {difficulty} Level
          </p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-48 h-48">
              <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${processScoreColor(percentage)}`}>
                  {percentage}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Score</span>
              </div>
            </div>
            <div className="flex space-x-6 w-full justify-center text-sm font-medium">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                {score} Correct
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                {wrongCount} Incorrect
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {percentage >= 80 ? "Excellent job! You have a strong grasp of the concepts." 
                 : percentage >= 50 ? "Good effort! Review the incorrect answers to improve." 
                 : "Keep practicing! Reviewing the fundamentals will help you score better next time."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 print:hidden">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Take Another Test
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600/50 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Review */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          Detailed Review
        </h2>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correct_answer;
            return (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10' : 'border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                      {idx + 1}. {q.question}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => {
                        let btnClass = "px-4 py-3 rounded-xl border text-sm font-medium ";
                        if (opt === q.correct_answer) {
                          btnClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-100";
                        } else if (opt === answers[idx]) {
                          // user selected this wrong option
                          btnClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-100";
                        } else {
                          btnClass += "bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 opacity-60";
                        }
                        
                        return (
                          <div key={oIdx} className={btnClass}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 rounded-xl text-sm leading-relaxed border border-indigo-100 dark:border-indigo-800/30">
                        <span className="font-bold flex items-center mb-1">
                          <LayoutDashboard className="h-4 w-4 mr-1" />
                          Explanation:
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Result;
