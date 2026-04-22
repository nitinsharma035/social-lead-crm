import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo Section */}
        <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">
          Lead CRM
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition-colors">Dashboard</Link>
          <Link to="/leads" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition-colors">Leads</Link>
          <Link to="/tasks" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition-colors">Tasks</Link>
          <Link to="/settings" className="block py-2.5 px-4 rounded hover:bg-slate-800 transition-colors">Settings</Link>
        </nav>

        {/* --- SIDEBAR FOOTER (Black Sidebar ke niche) --- */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
            Version 1.0
          </p>
          <p className="text-xs text-slate-400">
            © {currentYear} Developed by:
          </p>
          <p className="text-sm font-bold text-red-400 mt-1">
            Nitin Sharma
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-700">Overview</h2> 
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Admin: Nitin Sharma</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">NS</div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;