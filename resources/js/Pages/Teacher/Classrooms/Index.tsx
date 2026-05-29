import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Link, router, Head } from '@inertiajs/react';
import { Classroom } from '@/types';
import { 
    MonitorPlay, 
    Plus, 
    Users, 
    BookOpen, 
    ChevronRight, 
    Trash2, 
    Hash,
    CheckCircle2
} from 'lucide-react';

interface Props {
    classrooms: Classroom[];
    flash?: { success?: string };
}

export default function Index({ classrooms, flash }: Props) {
    const deleteClassroom = (id: number) => {
        if (confirm('Yakin ingin menghapus kelas ini beserta seluruh data siswa di dalamnya?')) {
            router.delete(`/teacher/classrooms/${id}`);
        }
    };

    return (
        <TeacherLayout>
            <Head title="Kelas Virtual" />

            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelas Virtual</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Kelola kelas, pantau siswa, dan distribusikan kuis Anda.</p>
                </div>
                <Link href="/teacher/classrooms/create"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus className="w-5 h-5" /> Buat Kelas Baru
                </Link>
            </div>

            {classrooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <MonitorPlay className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Belum ada kelas virtual</h3>
                    <p className="text-sm text-slate-500 mb-6">Mulai buat ruang kelas pertamamu untuk mengundang siswa!</p>
                    <Link href="/teacher/classrooms/create"
                        className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition border border-indigo-100">
                        Buat Kelas Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {classrooms.map((cls) => (
                        <div key={cls.id} className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                    <MonitorPlay className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kode Undangan</span>
                                    <span className="flex items-center gap-1 font-mono text-sm bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold tracking-wider">
                                        <Hash className="w-3.5 h-3.5 text-slate-400" /> {cls.invite_code}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{cls.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-2">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>{cls.subject?.name || 'Umum'} • Kelas {cls.grade} {cls.level}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    {cls.students_count} <span className="font-medium text-slate-500">Siswa</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => deleteClassroom(cls.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100" title="Hapus Kelas">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <Link href={`/teacher/classrooms/${cls.id}`} className="flex items-center gap-1 p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition font-bold text-sm">
                                        Detail <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </TeacherLayout>
    );
}