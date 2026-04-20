import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const skill = searchParams.get('skill');
  const difficulty = searchParams.get('difficulty');

  useEffect(() => {
    let timer;
    if (!loading && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !loading) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.post('/generate-questions', { skill, difficulty });
        if (response.data.questions && response.data.questions.length > 0) {
          setQuestions(response.data.questions);
        } else {
          setError('No questions generated. Try again.');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch questions. Ensure API key is set in backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [skill, difficulty]);

  const handleNext = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: selectedAnswer }));
    
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedAnswer(answers[nextIdx] || '');
    } else {
      handleSubmit({ ...answers, [currentIdx]: selectedAnswer });
    }
  };

  const handlePrevious = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: selectedAnswer }));
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setSelectedAnswer(answers[prevIdx] || '');
    }
  };

  const handleSubmit = async (finalAnswers = answers) => {
    setLoading(true);
    let score = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correct_answer) {
        score++;
      }
    });

    try {
      await api.post('/submit-test', {
        skill,
        difficulty,
        score,
        total_questions: questions.length
      });
      // Navigate to results
      navigate('/result', {
        state: { score, total: questions.length, questions, answers: finalAnswers, skill, difficulty }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to submit results.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Generating {difficulty} {skill} questions...
        </h3>
        <p className="text-gray-500 animate-pulse">Our AI is crafting your assessment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong.</h2>
        <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative z-10">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 glass-card p-6 rounded-3xl relative z-10 border-b border-white/10 shadow-2xl">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 capitalize mb-1">
            {skill} Test
          </h1>
          <span className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-wide rounded-full capitalize shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            {difficulty} Level
          </span>
        </div>
        <div className="flex items-center space-x-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-5 py-3 rounded-2xl font-mono font-bold text-2xl shadow-[0_0_15px_rgba(243,24,96,0.15)]">
          <Timer className="h-7 w-7 drop-shadow-[0_0_8px_currentColor]" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10 relative z-10">
        <div className="flex justify-between text-sm font-bold tracking-wider uppercase text-gray-400 mb-3">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span className="text-indigo-300">{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-4 bg-white/5 border border-white/10 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, type: 'spring' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="block glass-card rounded-[2rem] shadow-2xl p-8 md:p-12 relative z-10 border-t border-white/20"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-relaxed tracking-wide drop-shadow-md">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left px-8 py-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group overflow-hidden relative
                ${selectedAnswer === option 
                  ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] transform scale-[1.02]' 
                  : 'border-white/10 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className={`relative z-10 text-xl font-medium tracking-wide ${selectedAnswer === option ? 'text-white' : 'text-gray-300'}`}>
                {option}
              </span>
              {selectedAnswer === option && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                  <CheckCircle2 className="h-7 w-7 text-indigo-400 drop-shadow-[0_0_8px_currentColor]" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 flex justify-between pt-8 border-t border-white/10">
          <button
            onClick={handlePrevious}
            disabled={currentIdx === 0}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${currentIdx > 0 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 transform hover:-translate-x-1' 
                : 'bg-black/20 text-gray-600 cursor-not-allowed opacity-50 border border-transparent'}`}
          >
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`flex items-center space-x-3 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${selectedAnswer 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transform hover:translate-x-1' 
                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed border border-transparent'}`}
          >
            <span>{currentIdx === questions.length - 1 ? 'Submit Test' : 'Next'}</span>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;
