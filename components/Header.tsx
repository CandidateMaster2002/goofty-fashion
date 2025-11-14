import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User, ShoppingCart, BarChart2, Briefcase, Trello, Home, Wrench, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { Role } from '../types';
import { ROLES, APP_NAME } from '../constants';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, resetDemoData, cart } = useAppData();
  const isStorefront = currentRole === Role.Customer;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="text-2xl font-bold text-teal-700">
              {APP_NAME}
            </NavLink>
            <nav className="hidden md:flex items-center space-x-6">
              {isStorefront ? (
                <>
                  <NavLink to="/" className={({isActive}) => `text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}>Home</NavLink>
                  <NavLink to="/shop" className={({isActive}) => `text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}>Shop</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/admin/dashboard" className={({isActive}) => `flex items-center space-x-2 text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}><LayoutDashboard size={16} /><span>Dashboard</span></NavLink>
                  <NavLink to="/admin/rentals" className={({isActive}) => `flex items-center space-x-2 text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}><Briefcase size={16} /><span>Rentals</span></NavLink>
                  <NavLink to="/admin/orders" className={({isActive}) => `flex items-center space-x-2 text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}><Trello size={16} /><span>Orders</span></NavLink>
                  <NavLink to="/admin/inventory" className={({isActive}) => `flex items-center space-x-2 text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}><Wrench size={16} /><span>Inventory</span></NavLink>
                  <NavLink to="/admin/reports" className={({isActive}) => `flex items-center space-x-2 text-stone-600 hover:text-teal-700 ${isActive ? 'font-semibold text-teal-700' : ''}`}><BarChart2 size={16} /><span>Reports</span></NavLink>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
                <User size={16} className="text-stone-500" />
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as Role)}
                  className="bg-stone-100 border border-stone-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
            </div>
            {isStorefront && (
              <Link to="/checkout" className="relative p-2 rounded-full hover:bg-stone-100">
                <ShoppingCart/>
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
  );
};
