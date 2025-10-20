import { Link, useLocation } from "react-router-dom";
import Button from "../../common/Button";
import Logo from "../../common/Logo";

const AdminNavbar = () => {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin', label: 'Home', icon: '🏠' },
    { path: '/admin/payment', label: 'Payment Analytics', icon: '📊' },
    { path: '/admin/requests', label: 'Signup Requests', icon: '📝' },
    { path: '/admin/complains', label: 'Complaints', icon: '📞' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Brand */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-3 group">
              <Logo size="sm" variant="admin" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150">WanderLanka</h1>
                <span className="text-xs text-slate-600 font-medium">Admin Portal</span>
              </div>
            </Link>
          </div>

          {/* Center Section - Navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive(item.path) 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AD</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">System Administrator</span>
                  <span className="text-xs text-slate-500">Super Admin</span>
                </div>
              </div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout}
                className="focus:ring-red-500 focus:ring-offset-2 border border-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
