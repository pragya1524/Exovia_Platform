import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';


const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <div className="flex flex-1 min-w-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-2 sm:p-3 lg:p-4 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
