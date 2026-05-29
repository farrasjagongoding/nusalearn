import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Link, Head } from '@inertiajs/react';
import { 
    Plus, 
    FileText, 
    Globe, 
    Lock, 
    Eye, 
    Edit2, 
    Clock, 
    Layers,
    CheckCircle2
} from 'lucide-react';

interface QuizItem {
    id: number;
    title: string;
    duration: number;
    level: string;
    grade: string;
    is_public: boolean;
    questions_count: number;
    subject?: { name: string; icon?: string };
}

interface Props {
    quizzes: { 
        data: QuizItem[]; 
        current_page: number; 
        last_page: number;
    };
    flash?: { success?: string };
}

export default function Index({ quizzes, flash }: Props) {
    return (
        <TeacherLayout>
            <Head title="Kuis Saya" />
            
            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kuis Saya</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Kelola dan pantau semua kuis yang telah Anda buat.</p>
                </div>
                <Link href="/teacher/quizzes/create"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus className="w-5 h-5" /> Buat Kuis Baru
                </Link>
            </div>

            {quizzes.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Belum ada kuis</h3>
                    <p className="text-sm text-slate-500 mb-6">Mulai buat evaluasi atau latihan soal pertamamu!</p>
                    <Link href="/teacher/quizzes/create"
                        className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition border border-indigo-100">
                        Buat Kuis Sekarang
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Kuis</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mapel & Kelas</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Akses</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {quizzes.data.map((quiz) => (
                                    <tr key={quiz.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800 text-base leading-tight mb-1">{quiz.title}</p>
                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quiz.duration || 0} menit</span>
                                                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {quiz.questions_count || 0} soal</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{quiz.subject?.name || 'Umum'}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">{quiz.level || 'Umum'} - Kelas {quiz.grade || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md border ${
                                                quiz.is_public 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                                {quiz.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                {quiz.is_public ? 'Publik' : 'Privat'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/teacher/quizzes/${quiz.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition border border-transparent hover:border-indigo-100" title="Detail Kuis">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/teacher/quizzes/${quiz.id}/edit`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition border border-transparent hover:border-amber-100" title="Edit Kuis">
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </TeacherLayout>
    );
}