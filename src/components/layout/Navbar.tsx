import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BookOpen, Calendar, Users, LogOut } from 'lucide-react';

export default function Navbar() {
  const { profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Quizzes', path: '/quiz', icon: <BookOpen size={18} /> },
    { label: 'Timetable', path: '/timetable', icon: <Calendar size={18} /> },
    { label: 'Study Buddy', path: '/buddy', icon: <Users size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-black px-10 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-10">
        <Link to="/dashboard" className="text-3xl font-black tracking-tighter uppercase italic">
          TSMS.Core
        </Link>
        
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                location.pathname === item.path ? "text-black underline decoration-4 underline-offset-8" : "opacity-30 hover:opacity-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-tighter leading-none mb-1">{profile?.name}</p>
          <p className="text-[10px] opacity-50 uppercase tracking-widest leading-none">{profile?.role}</p>
        </div>
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black text-xs">
            {profile?.name?.charAt(0)}
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="ml-2 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
