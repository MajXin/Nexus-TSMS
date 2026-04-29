import React from 'react';
import { motion } from 'motion/react';
import { Button, Card } from '../components/ui/Elements';
import { signInWithGoogle } from '../lib/firebase';
import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 max-w-4xl"
      >
        <span className="inline-block px-4 py-1 border-2 border-black font-black text-xs uppercase tracking-widest mb-6">
          Nexus Management System
        </span>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
          TEACH <span className="text-white bg-black px-4">LEARN</span> EVOLVE.
        </h1>
        <p className="text-xl md:text-2xl font-medium tracking-tight mb-12 max-w-2xl mx-auto">
          A minimalist tech-driven ecosystem for modern educational management. AI quizzes, smart scheduling, and peer matching.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
          <Button onClick={signInWithGoogle} className="text-lg px-12 py-5">
            Get Started
          </Button>
          <Button variant="outline" className="text-lg px-12 py-5">
            Documentation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Feature icon={<BookOpen />} title="AI QUIZZES" desc="Personalized difficulty based on performance" />
          <Feature icon={<Calendar />} title="SCHEDULER" desc="Conflict-free lesson management" />
          <Feature icon={<Users />} title="BUDDY MATCH" desc="Connect with your ideal study partner" />
          <Feature icon={<GraduationCap />} title="ACHIEVEMENTS" desc="Gamified milestone tracking" />
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="flex flex-col items-center text-center p-8">
      <div className="mb-4 text-black">{icon}</div>
      <h3 className="font-black uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-sm opacity-60 font-medium">{desc}</p>
    </Card>
  );
}
