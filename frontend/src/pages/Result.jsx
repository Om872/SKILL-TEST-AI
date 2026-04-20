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
    <div className="max-w-5xl mx-auto py-8 space-y-8 relative z-10 px-4">
      {/* Background glow for Result */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div id="report-container" className="space-y-8 relative z-10">
      {/* Header and Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <h1 className="text-5xl font-black mb-3 tracking-wide drop-shadow-lg relative z-10">Test Completed!</h1>
          <p className="text-indigo-100/90 text-xl font-medium tracking-wider uppercase relative z-10">
            {skill.charAt(0).toUpperCase() + skill.slice(1)} <span className="opacity-50 mx-2">•</span> {difficulty} Level
          </p>
        </div>

        <div className="p-10 grid md:grid-cols-2 gap-10 items-center bg-white/5 border-t border-white/10">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-56 h-56 drop-shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-105 transition-transform duration-500">
              <Doughnut data={chartData} options={{ cutout: '78%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black drop-shadow-md ${processScoreColor(percentage)}`}>
                  {percentage}%
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">Score</span>
              </div>
            </div>
            <div className="flex space-x-8 w-full justify-center text-base font-bold">
              <div className="flex items-center text-green-400 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                {score} Correct
              </div>
              <div className="flex items-center text-red-400 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                {wrongCount} Incorrect
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-wide">Performance Analysis</h3>
              <p className="text-indigo-200 text-lg leading-relaxed">
                {percentage >= 80 ? "Stunning precision! You have a profound grasp of these concepts." 
                 : percentage >= 50 ? "Solid foundational effort! Review the incorrect answers below to refine your edge." 
                 : "Keep leveling up! Reviewing the fundamentals deeply will reconstruct your understanding."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 print:hidden pt-4 border-t border-white/10">
              <button
                onClick={() => navigate('/')}
                className="flex flex-1 items-center justify-center px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <RefreshCw className="h-5 w-5 mr-2 text-indigo-400" />
                Retake
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex flex-1 items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <LayoutDashboard className="h-5 w-5 mr-2 drop-shadow-md" />
                Dashboard
              </button>
              <button
                onClick={handleExportPDF}
                className="flex flex-1 items-center justify-center px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Download className="h-5 w-5 mr-2 text-blue-400" />
                Export
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Review */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card border border-white/20 rounded-[2.5rem] p-10 shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-8 border-b border-white/10 pb-6 inline-block w-full">
          Detailed Review
        </h2>
        <div className="space-y-8">
          {questions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correct_answer;
            return (
              <div 
                key={idx} 
                className={`p-8 rounded-[2rem] border-2 transition-all duration-300 hover:shadow-xl ${isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}
              >
                <div className="flex items-start gap-5">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="h-8 w-8 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="font-bold text-white mb-6 text-xl leading-relaxed tracking-wide">
                      {idx + 1}. {q.question}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => {
                        let btnClass = "px-6 py-4 rounded-xl border-2 text-sm font-semibold tracking-wide transition-all ";
                        if (opt === q.correct_answer) {
                          btnClass += "bg-green-500/20 border-green-500/50 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.15)]";
                        } else if (opt === answers[idx]) {
                          btnClass += "bg-red-500/20 border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
                        } else {
                          btnClass += "bg-white/5 border-white/5 text-gray-400 opacity-50";
                        }
                        
                        return (
                          <div key={oIdx} className={btnClass}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-6 p-6 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-2xl text-[15px] leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                        <span className="font-bold flex items-center mb-2 tracking-wide text-indigo-300">
                          <LayoutDashboard className="h-5 w-5 mr-2" />
                          Explanation
                        </span>
                        <div className="opacity-90">{q.explanation}</div>
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
