import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/ui/Elements';
import { motion } from 'motion/react';
import { Notice } from '../types';
import { Megaphone, Award, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(3));
      const snap = await getDocs(q);
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
    };
    fetchNotices();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto border-x-2 border-black min-h-screen grid grid-cols-12">
        
        {/* Profile Sidebar */}
        <aside className="col-span-12 lg:col-span-3 border-r-2 border-black p-8 flex flex-col justify-between bg-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Proficiency Index</p>
            <div className="text-7xl font-black leading-none mb-2 tracking-tighter">{profile?.studentData?.avgScore || 0}%</div>
            <div className="h-1.5 w-full bg-zinc-100 mb-8 border border-black/5">
              <div className="h-full bg-black" style={{ width: `${profile?.studentData?.avgScore || 0}%` }}></div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Core Strengths</p>
                <div className="flex flex-col gap-2">
                   {profile?.studentData?.strengths?.map(s => (
                     <p key={s} className="text-sm font-black uppercase italic tracking-tight">{s}</p>
                   )) || <p className="text-xs opacity-30 italic">No data yet</p>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Growth Areas</p>
                <div className="flex flex-col gap-2">
                   {profile?.studentData?.weaknesses?.map(w => (
                     <p key={w} className="text-sm font-black uppercase italic tracking-tight">{w}</p>
                   )) || <p className="text-xs opacity-30 italic">Determining...</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t-2 border-black pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Accolades</p>
            <div className="flex flex-wrap gap-3">
              {profile?.studentData?.badges.map((b, i) => (
                <div key={i} className="w-10 h-10 border-2 border-black flex items-center justify-center font-black text-xs hover:bg-black hover:text-white transition-colors cursor-help" title={b}>
                   {b.charAt(0).toUpperCase()}
                </div>
              ))}
              <div className="w-10 h-10 border-2 border-black bg-zinc-100 flex items-center justify-center font-black text-xs opacity-20">?</div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="col-span-12 lg:col-span-6 p-10 flex flex-col min-h-screen">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">
              Bulletin<br/>
              <span className="text-3xl font-normal lowercase italic text-zinc-400">nexus.live stream</span>
            </h2>
          </div>
          
          <div className="flex-1 border-t-2 border-black">
            <div className="divide-y-2 divide-black">
              {notices.length > 0 ? notices.map(notice => (
                <div key={notice.id} className="py-8 group cursor-pointer hover:bg-zinc-50 transition-colors px-4 -mx-4">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[10px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">AUTH:SYSTEM</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:italic mb-3">{notice.title}</h3>
                  <p className="text-sm font-medium leading-relaxed opacity-60 line-clamp-3">{notice.content}</p>
                </div>
              )) : (
                <div className="py-20 text-center opacity-20 font-black italic uppercase tracking-widest">Feed is empty</div>
              )}
            </div>
          </div>

          <div className="mt-12 p-6 bg-black text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase opacity-60">System Latency</p>
              <p className="text-sm font-black uppercase italic">Healthy • 14ms</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Deployment</p>
              <p className="text-sm font-black uppercase">v1.2.4-stable</p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3 border-l-2 border-black bg-zinc-50 p-8 flex flex-col gap-10">
          <Card className="bg-white border-4" hover={true}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40">AI recommendation</p>
            <h3 className="text-2xl font-black uppercase leading-tight mb-4 italic tracking-tighter">Adaptive Quiz</h3>
            <p className="text-xs text-zinc-500 mb-6 font-medium leading-relaxed">
              Based on your <span className="font-black text-black">84% SPI</span>, we have optimized a session focusing on growth areas.
            </p>
            <Link to="/quiz">
              <Button className="w-full py-4">Initialize Session</Button>
            </Link>
          </Card>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-40">Buddy Matching</p>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-[10px] text-white font-black italic">AX</div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase">Alex Rivera</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Logic Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-50">
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-[10px] text-white font-black italic">SM</div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase">Sarah Moon</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Design Lead</p>
                  </div>
                </div>
            </div>
            <Link to="/buddy" className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-50 transition-opacity">View all matches</Link>
          </div>

          <div className="mt-auto pt-8 border-t border-black/10">
             <div className="bg-black text-white p-4 font-mono text-[9px] leading-tight space-y-1">
                <p>Uptime: 99.98%</p>
                <p>Storage: 4.2GB / 10GB</p>
                <p>Status: Synchronized</p>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{label}</span>
      <span className="text-xl font-black tracking-tight">{value}</span>
    </div>
  );
}
