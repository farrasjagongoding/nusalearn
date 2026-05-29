export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    school?: string;
    avatar?: string;
    grade?: string;
    level_school?: 'SD' | 'SMP' | 'SMA';
}

export interface Subject {
    id: number;
    name: string;
    level: 'SD' | 'SMP' | 'SMA';
    icon?: string;
}

export interface Chapter {
    id: number;
    subject_id: number;
    name: string;
    grade: number;
    order: number;
    subject?: Subject;
}

export interface Quiz {
    id: number;
    teacher_id: number;
    title: string;
    description?: string;
    grade: number;
    level: 'SD' | 'SMP' | 'SMA';
    duration: number;
    is_public: boolean;
    is_active: boolean;
    questions_count?: number;
    subject?: Subject;
    chapter?: Chapter;
    teacher?: User;
    questions?: Question[];
}

export interface Question {
    id: number;
    quiz_id: number;
    content: string;
    type: 'multiple_choice' | 'essay';
    explanation?: string;
    order: number;
    points: number;
    time_limit: number;
    options?: Option[];
}

export interface Option {
    id: number;
    question_id: number;
    content: string;
    is_correct: boolean;
    label: string;
}

export interface Classroom {
    id: number;
    teacher_id: number;
    name: string;
    grade: number;
    level: 'SD' | 'SMP' | 'SMA';
    invite_code: string;
    is_active: boolean;
    description?: string;
    students_count?: number;
    subject?: Subject;
    teacher?: User;
    students?: User[];
}

export interface QuizSession {
    id: number;
    student_id: number;
    quiz_id: number;
    started_at: string;
    submitted_at?: string;
    score?: number;
    duration_taken?: number;
    total_points_earned: number;
    status: 'in_progress' | 'completed' | 'timeout';
    quiz?: Quiz;
    answers?: StudentAnswer[];
    student?: User;       // ← tambahkan ini
    classroom?: Classroom; // ← tambahkan ini
}

export interface StudentAnswer {
    id: number;
    session_id: number;
    question_id: number;
    selected_option_id?: number;
    is_correct: boolean;
    selectedOption?: Option;
}

export interface StudentPoint {
    id: number;
    student_id: number;
    total_points: number;
    level: number;
    experience: number;
    streak_days: number;
    last_activity_date?: string;
}

export interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    condition_type: string;
    condition_value: number;
    pivot?: { earned_at: string };
}

export interface PageProps {
    auth: { user: User };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}