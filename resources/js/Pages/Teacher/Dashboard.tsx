import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { PageProps } from '@/types';
import { 
    FileText, 
    MonitorPlay, 
    Users, 
    CheckCircle2, 
    Plus, 
    ChevronRight, 
    BookOpen, 
    Activity 
} from 'lucide-react';

interface DashboardProps extends PageProps {
    stats: {
        total_quizzes: number;
        total_classrooms: number;
        total_students: number;
        total_sessions: number;
    };
    recent_quizzes: {
        id: number;
        title: string;
        is_public: boolean;
        subject?: { id: number; name: string };
    }[];
    classrooms: {
        id: number;
        name: string;
        invite_code: string;
        students_count: number;
        subject?: { id: number; name: string };
    }[];
    flash?: { success?: string };
}

export default function Dashboard({ stats, recent_quizzes, classrooms, flash }: DashboardProps) {
    const { auth } = usePage<DashboardProps>().props;

    const statCards = [
        { title: 'Kuis Dibuat', value: stats.total_quizzes, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Kelas Aktif', value: stats.total_classrooms, icon: MonitorPlay, color: 'text-violet-600', bg: 'bg-violet-50' },
        { title: 'Total Siswa', value: stats.total_students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Sesi Selesai', value: stats.total_sessions, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <TeacherLayout>
            <Head title="Beranda Guru" />

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {flash.success}
                </div>
            )}

            {/* Header / Greeting */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Halo, {auth.user.name}! 👋
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Pantau perkembangan kelas dan kuis yang Anda buat hari ini.</p>
                </div>
                <Link href="/teacher/quizzes/create" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">
                    <Plus className="w-5 h-5" /> Buat Kuis Baru
                </Link>
            </div>

            {/* Stats Grid (Bento Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Section Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Left Column: Recent Quizzes */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" /> Kuis Terbaru Anda
                        </h2>
                        <Link href="/teacher/quizzes" className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1 group">
                            Lihat Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {recent_quizzes.length === 0 ? (
                            <div className="text-center py-10">
                                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium text-sm">Belum ada kuis yang dibuat.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recent_quizzes.map((quiz) => (
                                    <div key={quiz.id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 leading-tight">{quiz.title}</p>
                                                <p className="text-xs font-medium text-slate-500 mt-1">{quiz.subject?.name || 'Umum'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                                quiz.is_public ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                                {quiz.is_public ? 'Publik' : 'Privat'}
                                            </span>
                                            <Link href={`/teacher/quizzes/${quiz.id}`} className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-sm transition">
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Classrooms */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <MonitorPlay className="w-5 h-5 text-violet-600" /> Kelas Diampu
                        </h2>
                        <Link href="/teacher/classrooms" className="text-violet-600 text-sm font-bold hover:text-violet-800 flex items-center gap-1 group">
                            Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {classrooms.length === 0 ? (
                            <div className="text-center py-10">
                                <MonitorPlay className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium text-sm">Anda belum membuat kelas.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {classrooms.map((cls) => (
                                    <div key={cls.id} className="group flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-violet-50 border border-transparent hover:border-violet-100 rounded-xl transition cursor-pointer">
                                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center group-hover:border-violet-200">
                                            <Users className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-800 truncate">{cls.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-md">
                                                    {cls.students_count} Siswa
                                                </span>
                                                <span className="text-xs font-medium text-slate-500 truncate">
                                                    • {cls.subject?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </TeacherLayout>
    );
}