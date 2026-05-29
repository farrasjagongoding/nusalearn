import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Quiz, Subject, Chapter, PageProps } from '@/types';
import { 
    ArrowLeft, 
    Save, 
    BookOpen, 
    Layers, 
    Clock, 
    AlignLeft, 
    Globe, 
    Type, 
    GraduationCap,
    Users,
    Info
} from 'lucide-react';

// 1. Ekstensi tipe Quiz menggunakan Omit untuk membuang tipe kaku bawaan agar tidak bentrok
interface ExtendedQuiz extends Omit<Quiz, 'grade' | 'subject_id' | 'chapter_id' | 'duration' | 'description'> {
    subject_id?: number | string;
    chapter_id?: number | string;
    grade?: number | string;
    duration?: number | string;
    description?: string;
}

interface Props extends PageProps {
    quiz: ExtendedQuiz;
    subjects: Subject[];
    chapters: Chapter[];
}

// 2. Tambahkan antarmuka form
interface QuizForm {
    title: string;
    subject_id: string;
    chapter_id: string;
    grade: string;
    level: string;
    duration: string;
    description: string;
    is_public: boolean;
}

export default function Edit({ quiz, subjects, chapters }: Props) {
    // 3. Terapkan <QuizForm> ke useForm
    const { data, setData, patch, processing, errors } = useForm<QuizForm>({
        title: quiz.title || '',
        subject_id: quiz.subject_id?.toString() || '',
        chapter_id: quiz.chapter_id?.toString() || '',
        grade: quiz.grade?.toString() || '',
        level: quiz.level || '',
        duration: quiz.duration?.toString() || '30',
        description: quiz.description || '',
        is_public: quiz.is_public || false,
    });

    const filteredChapters = chapters.filter(
        (c) => !data.subject_id || c.subject_id === parseInt(data.subject_id)
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/teacher/quizzes/${quiz.id}`);
    };

    return (
        <TeacherLayout>
            <Head title={`Edit Kuis: ${quiz.title}`} />
            
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={`/teacher/quizzes/${quiz.id}`} className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 shadow-sm transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Detail Kuis</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Perbarui konfigurasi untuk kuis: <span className="font-bold text-slate-700">{quiz.title}</span></p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <Type className="w-4 h-4" /> Judul Kuis
                        </label>
                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 transition bg-slate-50 focus:bg-white"
                        />
                        {errors.title && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <GraduationCap className="w-4 h-4" /> Jenjang Pendidikan
                            </label>
                            <select value={data.level} onChange={(e) => setData('level', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 transition cursor-pointer">
                                <option value="SD">Sekolah Dasar (SD)</option>
                                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                                <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <Users className="w-4 h-4" /> Kelas
                            </label>
                            <select value={data.grade} onChange={(e) => setData('grade', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 transition cursor-pointer">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Kelas {i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <BookOpen className="w-4 h-4" /> Mata Pelajaran
                            </label>
                            <select value={data.subject_id} required
                                onChange={(e) => { setData('subject_id', e.target.value); setData('chapter_id', ''); }}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 transition cursor-pointer">
                                <option value="">- Pilih Mapel -</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <Layers className="w-4 h-4" /> Bab Materi
                            </label>
                            <select value={data.chapter_id} onChange={(e) => setData('chapter_id', e.target.value)} required
                                disabled={!data.subject_id}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 transition disabled:opacity-50 disabled:bg-slate-100 cursor-pointer">
                                <option value="">- Pilih Bab Terkait -</option>
                                {filteredChapters.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-1">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <Clock className="w-4 h-4" /> Durasi Kuis (Menit)
                            </label>
                            <input type="number" value={data.duration} onChange={(e) => setData('duration', e.target.value)}
                                min="5" max="180" required
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <AlignLeft className="w-4 h-4" /> Deskripsi (Opsional)
                            </label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
                            />
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border transition-colors cursor-pointer ${data.is_public ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                         onClick={() => setData('is_public', !data.is_public)}>
                        <div className="flex items-start gap-4">
                            <div className="pt-1">
                                <div className={`relative w-12 h-6 transition-colors rounded-full ${data.is_public ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_public ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Globe className={`w-4 h-4 ${data.is_public ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    Kuis Akses Publik Terbuka
                                </h4>
                                <p className="text-xs font-medium text-slate-500 mt-1 flex items-start gap-1.5">
                                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" /> 
                                    Guru atau siswa dari sekolah lain dapat mencari dan mengakses kuis ini di halaman Jelajah.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Link href={`/teacher/quizzes/${quiz.id}`}
                            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition text-center flex-shrink-0">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    );
}