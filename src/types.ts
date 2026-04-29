export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentData?: {
    avgScore: number;
    quizCount: number;
    badges: string[];
    strengths: string[];
    weaknesses: string[];
  };
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface Submission {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  audience: 'All' | 'Students' | 'Teachers';
  createdAt: string;
}
