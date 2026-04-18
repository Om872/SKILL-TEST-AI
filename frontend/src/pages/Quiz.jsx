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
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {skill} Test
          </h1>
          <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-full capitalize">
            {difficulty} Level
          </span>
        </div>
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-xl font-mono font-bold text-xl">
          <Timer className="h-6 w-6" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="block bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group
                ${selectedAnswer === option 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-transparent'}`}
            >
              <span className={`text-lg ${selectedAnswer === option ? 'text-indigo-900 dark:text-indigo-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                {option}
              </span>
              {selectedAnswer === option && (
                <CheckCircle2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIdx === 0}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-lg transition-all
              ${currentIdx > 0 
                ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transform hover:-translate-x-1' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50'}`}
          >
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-lg transition-all
              ${selectedAnswer 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transform hover:translate-x-1' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            <span>{currentIdx === questions.length - 1 ? 'Submit Test' : 'Next'}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;
