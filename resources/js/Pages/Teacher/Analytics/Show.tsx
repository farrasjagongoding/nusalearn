import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import { Classroom } from '@/types';
import { 
    ChevronLeft, 
    BarChart3, 
    Trophy, 
    Medal, 
    Target, 
    Users,
    BookOpen
} from 'lucide-react';

interface StudentStat {
    student: { id: number; name: string; avatar?: string };
    total_quizzes: number;
    avg_score: number;
    total_points: number;
}

interface TopicStat {
    avg_score: number;
    count: number;
}

interface Props {
    classroom: Classroom;
    studentStats: StudentStat[];
    topicStats: Record<string, TopicStat>;
}

export default function Show({ classroom, studentStats, topicStats }: Props) {
    
    // Helper untuk warna badge nilai
    const getStatusStyle = (score: number) => {
        if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    // Helper untuk warna progress bar
    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-400';
        return 'bg-rose-500';
    };

    return (
        <TeacherLayout>
            <Head title={`Analitik: ${classroom.name}`} />

            {/* Header Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                <Link href={`/teacher/classrooms/${classroom.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-indigo-600 transition mb-3">
                    <ChevronLeft className="w-4 h-4" /> Kembali ke Kelas
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-7 h-7 text-indigo-600" /> Analitik Performa Kelas
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Laporan komprehensif untuk <span className="font-bold text-slate-700">{classroom.name}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> {classroom.subject?.name || 'Umum'}
                        </span>
                        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                            Kelas {classroom.grade} {classroom.level}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel 1: Performa Per Topik (Progress Bars) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Target className="w-5 h-5 text-violet-600" /> Penguasaan Materi (Topik)
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {Object.keys(topicStats).length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                                <Target className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm font-medium">Belum ada data kuis yang dikerjakan.</p>
                            </div>
                        ) : (
                            Object.entries(topicStats).map(([topic, stat]) => (
                                <div key={topic} className="group p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition shadow-sm">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <span className="font-bold text-sm text-slate-800 block mb-0.5">{topic}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {stat.count} Kuis Diselesaikan
                                            </span>
                                        </div>
                                        <span className={`text-xs font-black px-2.5 py-1 rounded-md border shadow-sm ${getStatusStyle(stat.avg_score)}`}>
                                            {stat.avg_score}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(stat.avg_score)}`}
                                            style={{ width: `${stat.avg_score}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Panel 2: Performa Siswa (Leaderboard) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" /> Peringkat Siswa
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {studentStats.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                                <Trophy className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm font-medium">Belum ada siswa yang terekapitulasi.</p>
                            </div>
                        ) : (
                            studentStats
                                .sort((a, b) => b.avg_score - a.avg_score)
                                .map((stat, i) => (
                                <div key={stat.student.id}
                                    className={`flex items-center gap-4 p-3.5 rounded-xl border transition ${
                                        i === 0 ? 'bg-amber-50/50 border-amber-200 shadow-sm' :
                                        i === 1 ? 'bg-slate-50 border-slate-200' :
                                        i === 2 ? 'bg-orange-50/30 border-orange-200' :
                                        'bg-white border-slate-100 hover:bg-slate-50'
                                    }`}>
                                    
                                    {/* Rank Icon / Number */}
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-slate-100">
                                        {i === 0 ? <Trophy className="w-5 h-5 text-amber-500" /> :
                                         i === 1 ? <Medal className="w-5 h-5 text-slate-400" /> :
                                         i === 2 ? <Medal className="w-5 h-5 text-orange-500" /> :
                                         <span className="font-black text-slate-400 text-sm">{i + 1}</span>}
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-800 truncate">
                                            {stat.student.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                {stat.total_points} Poin
                                            </span>
                                            <span className="text-xs font-medium text-slate-500 truncate">
                                                • {stat.total_quizzes} kuis selesai
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Badge */}
                                    <div className={`font-black text-sm px-3 py-1.5 rounded-lg border shadow-sm ${getStatusStyle(stat.avg_score)}`}>
                                        {stat.avg_score}%
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}