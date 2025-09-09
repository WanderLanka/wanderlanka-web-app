import { Link } from "react-router-dom";
import { Button, Logo, NavLink, Container, Avatar } from "../common";

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const navItems = [
    { path: '/admin', label: 'Home', icon: '🏠' },
    { path: '/admin/payment', label: 'Payment Analytics', icon: '📊' },
    { path: '/admin/requests', label: 'Signup Requests', icon: '📝' },
    { path: '/admin/complains', label: 'Complaints', icon: '📞' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 h-18">
      <Container>
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
                  <NavLink 
                    to={item.path}
                    icon={item.icon}
                    activeClass="bg-blue-50 text-blue-700 shadow-sm"
                    inactiveClass="text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <Avatar 
                  name="System Administrator"
                  initials="AD"
                  bgColor="bg-gradient-to-br from-slate-600 to-slate-700"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">System Administrator</span>
                  <span className="text-xs text-slate-500">Super Admin</span>
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

export default AdminNavbar;
