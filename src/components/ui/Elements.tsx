import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={cn(
    "border-2 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200",
    hover && "hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
    className
  )}>
    {children}
  </div>
);

export const Button = ({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]",
    secondary: "bg-zinc-100 text-black border-2 border-black hover:bg-white",
    outline: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 font-black uppercase tracking-widest text-xs transition-all duration-200 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="space-y-1 w-full">
    {label && <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</label>}
    <input 
      className="w-full border-2 border-black p-3 bg-white focus:outline-none focus:ring-0 font-bold uppercase text-sm tracking-tight"
      {...props}
    />
  </div>
);
