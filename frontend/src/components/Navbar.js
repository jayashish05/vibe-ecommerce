import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Vibe Commerce
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className="hover:text-indigo-400 transition-colors font-medium flex items-center"
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-emerald-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 hover:text-indigo-400 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{user?.name}</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
