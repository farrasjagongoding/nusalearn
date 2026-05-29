import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Subject } from '@/types';
import { 
    ArrowLeft, 
    Save, 
    MonitorPlay, 
    GraduationCap, 
    Users, 
    BookOpen, 
    AlignLeft,
    Type
} from 'lucide-react';

interface Props {
    subjects: Subject[];
}

interface ClassroomForm {
    name: string;
    subject_id: string;
    grade: string;
    level: string;
    description: string;
}

export default function Create({ subjects }: Props) {
    const { data, setData, post, processing, errors } = useForm<ClassroomForm>({
        name: '',
        subject_id: '',
        grade: '',
        level: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/classrooms');
    };

    return (
        <TeacherLayout>
            <Head title="Buat Kelas Virtual" />

            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/teacher/classrooms" className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 shadow-sm transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Buat Kelas Virtual</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Kelas baru otomatis mendapatkan kode undangan unik untuk siswa.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    {/* Nama Kelas */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <Type className="w-4 h-4" /> Nama Kelas
                        </label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required
                            placeholder="Contoh: Matematika 8A"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 bg-slate-50 focus:bg-white transition"
                        />
                        {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                    </div>

                    {/* Jenjang & Kelas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <GraduationCap className="w-4 h-4" /> Jenjang Pendidikan
                            </label>
                            <select value={data.level} onChange={(e) => setData('level', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 cursor-pointer transition">
                                <option value="">- Pilih Jenjang -</option>
                                <option value="SD">Sekolah Dasar (SD)</option>
                                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                                <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                            </select>
                            {errors.level && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.level}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                <Users className="w-4 h-4" /> Tingkat Kelas
                            </label>
                            <select value={data.grade} onChange={(e) => setData('grade', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 cursor-pointer transition">
                                <option value="">- Pilih Kelas -</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Kelas {i + 1}</option>
                                ))}
                            </select>
                            {errors.grade && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.grade}</p>}
                        </div>
                    </div>

                    {/* Mata Pelajaran */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <BookOpen className="w-4 h-4" /> Mata Pelajaran Terkait
                        </label>
                        <select value={data.subject_id} onChange={(e) => setData('subject_id', e.target.value)} required
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-800 cursor-pointer transition">
                            <option value="">- Pilih Mata Pelajaran -</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                            ))}
                        </select>
                        {errors.subject_id && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.subject_id}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                            <AlignLeft className="w-4 h-4" /> Deskripsi (Opsional)
                        </label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3}
                            placeholder="Deskripsi singkat atau aturan tentang kelas ini..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Link href="/teacher/classrooms"
                            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition text-center flex-shrink-0">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                            <MonitorPlay className="w-5 h-5" /> {processing ? 'Membuat Kelas...' : 'Buat Kelas Virtual'}
                        </button>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    );
}