import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Classroom, QuizSession } from '@/types';
import { 
    ChevronLeft, 
    BarChart2, 
    Hash, 
    Users, 
    Activity, 
    UserMinus, 
    Award,
    AlertCircle,
    BookOpen
} from 'lucide-react';

interface Props {
    classroom: Classroom;
    sessions: QuizSession[];
}

export default function Show({ classroom, sessions }: Props) {
    const removeStudent = (studentId: number) => {
        if (confirm('Keluarkan siswa ini dari kelas secara permanen?')) {
            router.delete(`/teacher/classrooms/${classroom.id}/students/${studentId}`);
        }
    };

    return (
        <TeacherLayout>
            <Head title={`Kelas: ${classroom.name}`} />

            {/* Header / Info Kelas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div>
                        <Link href="/teacher/classrooms" className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-indigo-600 transition mb-3">
                            <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{classroom.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" /> {classroom.subject?.name || 'Mapel Umum'}
                            </span>
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                Kelas {classroom.grade} {classroom.level}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Box Kode Undangan */}
                        <div className="flex flex-col items-center justify-center bg-violet-50 border border-violet-100 rounded-xl px-5 py-2.5 min-w-[140px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-0.5">Kode Undangan</span>
                            <span className="font-mono font-black text-violet-700 text-xl tracking-widest flex items-center gap-1">
                                <Hash className="w-5 h-5 text-violet-400" /> {classroom.invite_code}
                            </span>
                        </div>
                        {/* Tombol Analitik */}
                        <Link href={`/teacher/analytics/${classroom.id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-sm transition">
                            <BarChart2 className="w-5 h-5" /> Lihat Analitik
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel 1: Daftar Siswa */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" /> Daftar Siswa
                        </h2>
                        <span className="bg-indigo-50 text-indigo-600 font-bold text-xs px-3 py-1 rounded-full border border-indigo-100">
                            {classroom.students?.length ?? 0} Siswa
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {(classroom.students?.length ?? 0) === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm font-medium">Belum ada siswa yang bergabung.</p>
                                <p className="text-slate-400 text-xs mt-1">Berikan kode undangan <span className="font-mono font-bold text-slate-600">{classroom.invite_code}</span> kepada siswa.</p>
                            </div>
                        ) : (
                            classroom.students?.map((student) => (
                                <div key={student.id} className="group flex justify-between items-center p-3 sm:p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-sm shadow-inner">
                                            {student.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{student.name}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">{student.school ?? 'Sekolah tidak diatur'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeStudent(student.id)} 
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-100 sm:opacity-0 group-hover:opacity-100" 
                                        title="Keluarkan Siswa">
                                        <UserMinus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Panel 2: Aktivitas Kuis Terbaru */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
                    <div className="flex items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" /> Aktivitas Penyelesaian Kuis
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {sessions.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                                <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 text-sm font-medium">Belum ada aktivitas pengerjaan kuis.</p>
                            </div>
                        ) : (
                            sessions.map((session) => {
                                const score = session.score ?? 0;
                                const isPassed = score >= 80;
                                const isAverage = score >= 60 && score < 80;

                                return (
                                    <div key={session.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                                {session.student?.name}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 mt-1 truncate max-w-[200px] sm:max-w-[250px]">
                                                {session.quiz?.title}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm font-black text-sm tracking-wide ${
                                            isPassed 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : isAverage
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            {isPassed ? <Award className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            {score}%
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}