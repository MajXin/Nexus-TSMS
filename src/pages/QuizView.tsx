import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generatePersonalizedQuiz } from '../services/geminiService';
import { Card, Button, Input } from '../components/ui/Elements';
import { QuizQuestion } from '../types';
import { CheckCircle2, ChevronRight, Play, Loader2, Award } from 'lucide-react';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

export default function QuizView() {
  const { profile, refreshProfile } = useAuth();
  const [subject, setSubject] = useState('General Science');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<{ score: number, total: number } | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    setResults(null);
    try {
      const perf = `Average Score: ${profile?.studentData?.avgScore}%, Total Quizzes: ${profile?.studentData?.quizCount}. Areas of improvement: ${profile?.studentData?.weaknesses.join(', ')}`;
      const difficulty = profile?.studentData?.avgScore && profile.studentData.avgScore > 80 ? 'Hard' : 
                         profile?.studentData?.avgScore && profile.studentData.avgScore > 50 ? 'Medium' : 'Easy';
      
      const newQuestions = await generatePersonalizedQuiz(subject, difficulty, perf);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setAnswers([]);
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentIndex < (questions?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = async (finalAnswers: number[]) => {
    if (!questions) return;
    let correct = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) correct++;
    });

    const scorePct = (correct / questions.length) * 100;
    setResults({ score: correct, total: questions.length });

    // Update profile in Firebase
    if (profile) {
        const userRef = doc(db, 'users', profile.uid);
        const newAvg = profile.studentData ? (profile.studentData.avgScore * profile.studentData.quizCount + scorePct) / (profile.studentData.quizCount + 1) : scorePct;
        
        await updateDoc(userRef, {
            'studentData.avgScore': Math.round(newAvg),
            'studentData.quizCount': increment(1),
            'studentData.badges': scorePct === 100 ? arrayUnion('Quiz Master') : arrayUnion()
        });
        await refreshProfile();
    }
  };

  if (results) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Award size={80} className="mb-6" />
        <h2 className="text-4xl font-black uppercase mb-2">Quiz Complete!</h2>
        <p className="text-xl font-medium mb-8">You scored {results.score} out of {results.total}</p>
        
        <Card className="w-full mb-8">
            <div className="flex justify-between items-center px-4 py-2 border-b-2 border-black mb-4">
                <span className="font-black uppercase text-xs">Performance Index</span>
                <span className="font-black">{Math.round((results.score / results.total) * 100)}%</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              {results.score === results.total ? "Perfect score! You've mastered this topic. We'll increase the difficulty next time." : 
               results.score > results.total / 2 ? "Great job! You're making progress. Focus on your weak areas." : 
               "Keep practicing. Review the foundational concepts and try again."}
            </p>
        </Card>

        <Button onClick={() => setQuestions(null)} className="px-12">Return to Labs</Button>
      </div>
    );
  }

  if (questions) {
    const q = questions[currentIndex];
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1">Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex-1 mx-8 h-1 bg-zinc-200">
                <div className="h-full bg-black transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-12 leading-tight">{q.question}</h2>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => submitAnswer(idx)}
              className="flex items-center justify-between p-6 border-3 border-black text-left font-black uppercase tracking-tight hover:bg-black hover:text-white transition-all group"
            >
              <span>{opt}</span>
              <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Quiz Engine</h1>
      <p className="text-zinc-500 font-medium tracking-tight mb-12">Nexus AI generates lessons tailored to your specific performance metrics.</p>

      <Card className="max-w-xl">
        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
            <Play size={18} /> Configure Session
        </h3>
        <div className="space-y-6">
          <Input 
            label="Subject Area" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="e.g. Physics, History, JS..."
          />
          
          <div className="bg-zinc-100 p-4 border-2 border-black flex items-center gap-4">
            <Loader2 className={cn("text-black", loading && "animate-spin")} size={24} />
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-zinc-500 block">Adaptive Difficulty</span>
              <span className="font-black text-sm uppercase">Currently Level: {profile?.studentData?.avgScore && profile.studentData.avgScore > 80 ? 'Hard' : profile?.studentData?.avgScore && profile.studentData.avgScore > 50 ? 'Medium' : 'Easy'}</span>
            </div>
          </div>

          <Button 
            onClick={startQuiz} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-16"
          >
            {loading ? "Generating Quiz..." : "Initialize Session"}
            {!loading && <ChevronRight size={20} />}
          </Button>
        </div>
      </Card>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
            <h4 className="font-black uppercase text-sm mb-4">How it works</h4>
            <ul className="space-y-3 text-sm font-medium text-zinc-600">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-black shrink-0" /> Neural analysis of your previous scores</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-black shrink-0" /> Focus on identified weakness areas</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-black shrink-0" /> Real-time feedback and difficulty scaling</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
