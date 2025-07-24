import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';


const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="relative overflow-hidden backdrop-blur-xl bg-[#fdfaf5]/80 border-b border-[#e6e0d6] shadow-lg transition-all duration-300">
      
      {/* Removed cool tone background animations */}
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={handleLogoClick}
            >
              <img
                src="/FullLogo_NoBuffer.png"  
                alt="Exovia logo"
                className="w-12 h-12 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />

              <div>
                <h2 className="text-2xl font-bold text-[#6b4f3b]">
                  Exovia Analytics
                </h2>
                <p className="text-sm text-[#7a7066] font-medium">
                  Excel Data Visualization Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Theme Toggle and User */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d0a26c]/10 rounded-lg blur-sm"></div>
              <div className="relative">
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#5a4635] flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {user?.name}
                </p>
                <p className="text-xs text-[#8c7e74] capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#d0a26c] rounded-full"></span>
                  {user?.role}
                </p>
              </div>
            </div>

            <UserDropdown />
          </div>
        </div>

        {/* Warm tone accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d0a26c]/50 via-[#b38b5d]/50 to-[#a27850]/50"></div>
      </div>
    </header>
  );
};

export default Header;
