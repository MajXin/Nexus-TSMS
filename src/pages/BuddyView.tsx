import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/ui/Elements';
import { matchStudyBuddy } from '../services/geminiService';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Users, Search, Loader2, UserCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function BuddyView() {
  const { profile } = useAuth();
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState<{ matchId: string, reason: string } | null>(null);
  const [buddyProfile, setBuddyProfile] = useState<any>(null);

  const findBuddy = async () => {
    setMatching(true);
    setMatch(null);
    try {
      // Find other students
      const q = query(collection(db, 'users'), where('role', '==', 'Student'), limit(10));
      const snap = await getDocs(q);
      const candidates = snap.docs.filter(d => d.id !== profile?.uid).map(d => ({ id: d.id, ...d.data() }));

      if (candidates.length === 0) {
          alert("No other students found yet.");
          return;
      }

      const result = await matchStudyBuddy(profile, candidates);
      setMatch(result);
      
      const matchedUser = candidates.find(c => c.id === result.matchId);
      setBuddyProfile(matchedUser);
    } catch (e) {
      alert("Failed to find a match. Try again later.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col min-h-[80vh]">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Study Buddy</h1>
      <p className="text-zinc-500 font-medium tracking-tight mb-12">Our AI analyzes strengths and weaknesses to pair you with the ideal collaborator.</p>

      {!match ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-12 relative">
                <Users size={120} className="text-zinc-100" />
                <motion.div 
                    animate={matching ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                   <Search size={48} className={matching ? "text-black" : "text-zinc-300"} />
                </motion.div>
            </div>
            
            <h2 className="text-2xl font-black uppercase mb-4">Find your counterpart</h2>
            <p className="max-w-md text-zinc-500 font-medium mb-8">
                We'll look for someone whose strengths complement your weaknesses, creating a dual-growth partnership.
            </p>
            
            <Button 
                onClick={findBuddy} 
                disabled={matching}
                className="px-12 h-16 flex items-center gap-4"
            >
                {matching ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {matching ? "Analyzing Profiles..." : "Scan for Matches"}
            </Button>
          </div>
      ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
          >
            <div className="flex items-center gap-4 mb-4">
                <UserCheck size={48} />
                <span className="text-3xl font-black uppercase">We found a match!</span>
            </div>
            
            <Card className="max-w-2xl w-full border-4">
                <div className="flex flex-col md:flex-row gap-8 items-center p-4">
                    <div className="w-32 h-32 bg-black flex items-center justify-center text-white font-black text-4xl">
                        {buddyProfile?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-3xl font-black uppercase">{buddyProfile?.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                        </div>
                        <p className="font-bold text-zinc-400 uppercase text-xs mb-4">Performance Index: {buddyProfile?.studentData?.avgScore}%</p>
                        
                        <div className="bg-zinc-50 border-2 border-black p-4 mb-6">
                            <p className="text-sm font-black italic">"{match.reason}"</p>
                        </div>
                        
                        <div className="flex gap-2">
                             <Button className="flex-1">Connect Now</Button>
                             <Button variant="outline" onClick={() => setMatch(null)}>Find Another</Button>
                        </div>
                    </div>
                </div>
            </Card>
          </motion.div>
      )}
    </div>
  );
}
