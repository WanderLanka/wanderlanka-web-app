import { Link } from "react-router-dom";
import { Button, Logo, NavLink, Container, Avatar } from "../common";
import { AlertTriangle } from "lucide-react";

const TransportNavbar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const navItems = [
    { path: '/transport', label: 'Overview' },
    { path: '/transport/vehicles', label: 'Fleet Management' },
    { path: '/transport/trips', label: 'Operations' },
    { path: '/transport/drivers', label: 'Personnel' },
    { path: '/transport/payments', label: 'Financial' },
    { path: '/transport/complaints', label: 'Complaints', icon: AlertTriangle },
    { path: '/transport/profile', label: 'Account' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand */}
          <Link to="/transport" className="flex items-center space-x-3 group">
            <Logo size="sm" variant="transport" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-150">WanderLanka</h1>
              <span className="text-sm text-slate-500 font-medium">Transport Solutions</span>
            </div>
          </Link>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path}
                      activeClass="bg-emerald-50 text-emerald-700 shadow-sm"
                      inactiveClass="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-1">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <Avatar 
                  name="Transport Provider"
                  initials="TP"
                  bgColor="bg-gradient-to-br from-emerald-600 to-emerald-700"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">Transport Provider</span>
                  <span className="text-xs text-slate-500">Administrator</span>
                </div>
              </div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout}
                className="focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default TransportNavbar;
