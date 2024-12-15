import React from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  BarChart2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavLink({ to, icon, label, isActive }: NavLinkProps) {
  return (
    <RouterLink
      to={to}
      className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {icon}
      {label}
    </RouterLink>
  );
}

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-8">
            <NavLink
              to="/"
              icon={<LayoutDashboard className="mr-2 h-5 w-5" />}
              label="Kanban Board"
              isActive={isActive('/')}
            />
            <NavLink
              to="/analytics"
              icon={<LineChart className="mr-2 h-5 w-5" />}
              label="Analytics"
              isActive={isActive('/analytics')}
            />
            
            {user?.role === 'admin' && (
              <>
                <NavLink
                  to="/admin/users"
                  icon={<Users className="mr-2 h-5 w-5" />}
                  label="User Management"
                  isActive={isActive('/admin/users')}
                />
                <NavLink
                  to="/admin/analytics"
                  icon={<BarChart2 className="mr-2 h-5 w-5" />}
                  label="Sales Overview"
                  isActive={isActive('/admin/analytics')}
                />
              </>
            )}
          </div>
          
          <button
            onClick={logout}
            className="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}