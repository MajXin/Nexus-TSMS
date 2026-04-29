import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui/Elements';
import { TimetableSlot } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X, AlertOctagon } from 'lucide-react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableView() {
  const { profile } = useAuth();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimetableSlot>>({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    subject: '',
    room: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const q = query(collection(db, 'timetable'));
    const snap = await getDocs(q);
    setSlots(snap.docs.map(d => ({ id: d.id, ...d.data() } as TimetableSlot)));
  };

  const handleAdd = async () => {
    setError(null);
    if (!newSlot.subject || !newSlot.room || !newSlot.startTime || !newSlot.endTime) {
        setError("Please fill all fields.");
        return;
    }

    // CLIENT SIDE CONFLICT DETECTION
    const conflict = slots.find(s => 
        s.day === newSlot.day && 
        ((newSlot.startTime! < s.endTime && newSlot.endTime! > s.startTime)) &&
        (s.room === newSlot.room || s.teacherId === profile?.uid)
    );

    if (conflict) {
        setError(`Conflict detected with ${conflict.subject} at ${conflict.room}.`);
        return;
    }

    try {
        await addDoc(collection(db, 'timetable'), {
            ...newSlot,
            teacherId: profile?.uid,
            classId: 'manual-class' // Placeholder
        });
        fetchSlots();
        setShowAdd(false);
    } catch (e) {
        setError("Failed to save slot.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Scheduler</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Smart scheduling with built-in conflict awareness.</p>
        </div>
        {profile?.role !== 'Student' && (
          <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2">
            <Plus size={20} /> Add Slot
          </Button>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
          <Card className="max-w-lg w-full bg-white relative">
            <button onClick={() => setShowAdd(false)} className="absolute top-4 right-4"><X size={24}/></button>
            <h2 className="text-2xl font-black uppercase mb-6">New Appointment</h2>
            
            {error && (
                <div className="bg-red-50 border-2 border-red-500 p-4 mb-6 flex gap-3 text-red-600">
                    <AlertOctagon className="shrink-0" />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                    <Input label="Subject" value={newSlot.subject} onChange={e => setNewSlot({...newSlot, subject: e.target.value})} />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Day</label>
                   <select 
                        className="w-full border-3 border-black p-3 bg-white font-black uppercase text-xs"
                        value={newSlot.day}
                        onChange={e => setNewSlot({...newSlot, day: e.target.value as any})}
                    >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                <div>
                     <Input label="Room" value={newSlot.room} onChange={e => setNewSlot({...newSlot, room: e.target.value})} />
                </div>
                <div>
                    <Input label="Start Time" type="time" value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
                </div>
                <div>
                    <Input label="End Time" type="time" value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
                </div>
            </div>

            <Button onClick={handleAdd} className="w-full">Secure Slot</Button>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {DAYS.map(day => (
          <div key={day} className="space-y-4">
            <h3 className="font-black uppercase tracking-widest text-[10px] text-center bg-black text-white py-2">{day}</h3>
            <div className="space-y-4 min-h-[400px]">
                {slots.filter(s => s.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => (
                    <div key={slot.id}>
                      <Card className="p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0 hover:translate-x-0 cursor-default">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block border-b border-black/5 pb-1 mb-2">
                              {slot.startTime} - {slot.endTime}
                          </span>
                          <p className="font-black leading-tight uppercase mb-2">{slot.subject}</p>
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tight text-zinc-500">
                               <MapPin size={10} /> {slot.room}
                          </div>
                      </Card>
                    </div>
                ))}
                {slots.filter(s => s.day === day).length === 0 && (
                    <div className="h-full border-2 border-dashed border-zinc-200" />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
