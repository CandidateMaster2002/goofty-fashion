import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User, ShoppingCart, BarChart2, Briefcase, Trello, Home, Wrench, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { Role } from '../types';
import { ROLES, APP_NAME } from '../constants';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, resetDemoData, cart, openCustomOrderModal } = useAppData();
  const isStorefront = currentRole === Role.Customer;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinkClass = ({isActive}: {isActive: boolean}) => 
    `text-slate-600 hover:text-primary-600 transition-colors duration-200 ${isActive ? 'font-semibold text-primary-600' : ''}`;

  const adminNavLinkClass = ({isActive}: {isActive: boolean}) => 
    `flex items-center space-x-2 text-slate-600 hover:text-primary-600 transition-colors duration-200 ${isActive ? 'font-semibold text-primary-600' : ''}`;


  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <NavLink to="/" className="text-3xl font-extrabold">
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  {APP_NAME}
                </span>
              </NavLink>
              <nav className="hidden md:flex items-center space-x-6">
                {isStorefront ? (
                  <>
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/shop" className={navLinkClass}>Buy/Rent</NavLink>
                    <button onClick={openCustomOrderModal} className="text-slate-600 hover:text-primary-600">
                      Custom Order
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/admin/dashboard" className={adminNavLinkClass}><LayoutDashboard size={16} /><span>Dashboard</span></NavLink>
                    <NavLink to="/admin/rentals" className={adminNavLinkClass}><Briefcase size={16} /><span>Rentals</span></NavLink>
                    <NavLink to="/admin/orders" className={adminNavLinkClass}><Trello size={16} /><span>Custom Orders</span></NavLink>
                    <NavLink to="/admin/inventory" className={adminNavLinkClass}><Wrench size={16} /><span>Inventory</span></NavLink>
                    <NavLink to="/admin/reports" className={adminNavLinkClass}><BarChart2 size={16} /><span>Reports</span></NavLink>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                  <User size={16} className="text-slate-500" />
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as Role)}
                    className="bg-slate-100 border border-slate-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
              </div>
              {isStorefront && (
                <Link to="/checkout" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <ShoppingCart className="text-slate-600"/>
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              <Button onClick={resetDemoData} variant="secondary" size="sm" title="Reset Demo Data">
                <LogOut size={16}/>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};