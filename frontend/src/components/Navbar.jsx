import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, BrainCircuit, Activity, Trophy } from 'lucide-react';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  return (
    <nav className="print:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillTest AI
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  <Activity className="h-5 w-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-1 text-gray-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 font-medium transition-colors"
                >
                  <Trophy className="h-5 w-5" />
                  <span className="hidden sm:inline">Top Ranks</span>
                </Link>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/30"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
