import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3,
  MessageSquare,
  History,
  Users,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'History', href: '/history', icon: History },
  ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin', icon: Users }] : []),
];

  return (
    <div className={cn(
      "transition-all duration-700 ease-in-out flex flex-col border-r border-[#e6e0d6]",
      "bg-[#fdfaf5]",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "border-b border-[#e6e0d6] transition-all duration-700 ease-in-out",
        isCollapsed ? "p-3" : "p-4"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
              <img 
                src="/FullLogo_NoBuffer.png"
                alt="Exovia Logo"
                className="w-10 h-10 rounded-xl shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
              />
              <div className="transition-all duration-700 ease-in-out">
                <h1 className="text-xl font-bold text-[#6b4f3b]">
                  Exovia
                </h1>
                <p className="text-xs text-[#7a7066]">Analytics</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-[#ece7df] transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft size={20} className="text-[#7a7066]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/FullLogo_NoBuffer.png"
              alt="Exovia Logo"
              className="w-10 h-10 rounded-xl shadow-lg transition-all duration-300"
            />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-[#ece7df] transition-all duration-300"
            >
              <ArrowRight size={18} className="text-[#7a7066]" />
            </button>
          </div>
        )}
      </div>

      <nav className={cn(
        "flex-1 transition-all duration-700 ease-in-out",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href === '/dashboard' && location.pathname === '/');
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center transition-all duration-500 ease-in-out group relative overflow-hidden",
                    isCollapsed 
                      ? "px-2 py-3 rounded-lg justify-center" 
                      : "px-3 py-3 rounded-xl",
                    isActive
                      ? "bg-[#f3ede4] border-l-4 border-[#d0a26c] text-[#7a5c3e]"
                      : "hover:bg-[#ece7df] hover:text-[#5a4635]"
                  )}
                >
                  <item.icon 
                    size={isCollapsed ? 20 : 22} 
                    className={cn(
                      "transition-all duration-300 flex-shrink-0",
                      isActive
                        ? "text-[#a27850]"
                        : "text-[#8c7e74] group-hover:text-[#5a4635]"
                    )} 
                  />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium truncate">
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#5a4635] text-[#fdfaf5] text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
