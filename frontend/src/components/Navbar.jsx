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
    <nav className="print:hidden mt-4 mx-4 sm:mx-8 lg:mx-auto max-w-7xl glass-pill sticky top-4 z-50 rounded-2xl shadow-2xl transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 shadow-lg shadow-indigo-500/30 transition-all duration-300">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
              SkillTest AI
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white hover:text-shadow-glow font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Activity className="h-5 w-5 text-indigo-400" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="h-4 w-px bg-white/10"></div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white hover:text-shadow-glow font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <User className="h-5 w-5 text-purple-400" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <div className="h-4 w-px bg-white/10"></div>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white hover:text-shadow-glow font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="hidden sm:inline">Top Ranks</span>
                </Link>
                <div className="h-4 w-px bg-white/10"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 hover:text-shadow-glow font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-all duration-300 px-4 py-2 hover:bg-white/5 rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transform hover:-translate-y-0.5"
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
