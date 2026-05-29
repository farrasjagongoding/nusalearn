import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Subject } from '@/types';
import { Plus, Edit2, Trash2, X, BookOpen, Layers, GraduationCap, Library } from 'lucide-react';

interface Props {
    subjects: (Subject & { chapters_count: number })[];
    flash?: { success?: string };
}

export default function Index({ subjects, flash }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        level: 'SD',
        icon: '📚', // Default sementara jika user tetap mau pakai emoji teks
    });

    const openModal = (subject: Subject | null = null) => {
        clearErrors();
        setEditingSubject(subject);
        if (subject) {
            setData({
                name: subject.name,
                level: subject.level,
                icon: subject.icon || '📚',
            });
        } else {
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setEditingSubject(null);
            clearErrors();
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            put(`/admin/subjects/${editingSubject.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/admin/subjects', { onSuccess: () => closeModal() });
        }
    };

    const deleteSubject = (id: number) => {
        if (confirm('Hapus mata pelajaran ini beserta semua bab di dalamnya secara permanen?')) {
            router.delete(`/admin/subjects/${id}`);
        }
    };

    // Fungsi pembantu untuk menentukan warna badge berdasarkan jenjang
    const LevelBadge = ({ level }: { level: string }) => {
        if (level === 'SD') return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md"><GraduationCap className="w-3 h-3" /> SD</span>;
        if (level === 'SMP') return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md"><GraduationCap className="w-3 h-3" /> SMP</span>;
        return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-md"><GraduationCap className="w-3 h-3" /> SMA</span>;
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Mata Pelajaran" />

            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <Library className="w-5 h-5" /> {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mata Pelajaran</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Kelola daftar mata pelajaran beserta kategori jenjangnya.</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus className="w-5 h-5" /> Tambah Mapel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {subjects.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700">Belum Ada Mata Pelajaran</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">Mulai tambahkan mata pelajaran pertama Anda ke dalam sistem.</p>
                        <button onClick={() => openModal()} className="text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
                            + Buat Sekarang
                        </button>
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <div key={subject.id} className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                                    {/* Jika icon dari DB berupa emoji text, tampilkan. Jika kosong, pakai fallback SVG */}
                                    {subject.icon || <BookOpen className="w-6 h-6 text-slate-400" />}
                                </div>
                                <LevelBadge level={subject.level} />
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{subject.name}</h3>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-2">
                                    <Layers className="w-4 h-4 text-slate-400" />
                                    <span>{subject.chapters_count} Bab Materi</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                                <button onClick={() => openModal(subject)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition border border-transparent hover:border-indigo-100">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => deleteSubject(subject.id)} className="flex items-center justify-center p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition border border-transparent hover:border-rose-100" title="Hapus">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800">
                                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="flex gap-4">
                                <div className="w-1/4">
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Ikon</label>
                                    <input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)}
                                        className="w-full text-center text-2xl border border-slate-200 rounded-xl py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-slate-50" 
                                        placeholder="📚" />
                                    {errors.icon && <p className="text-rose-500 text-[10px] mt-1 font-medium">{errors.icon}</p>}
                                </div>
                                <div className="w-3/4">
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Nama Mapel</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition" 
                                        placeholder="Misal: Biologi" />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Jenjang Pendidikan</label>
                                <select value={data.level} onChange={e => setData('level', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition bg-white cursor-pointer">
                                    <option value="SD">Sekolah Dasar (SD)</option>
                                    <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                                    <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                                </select>
                                {errors.level && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.level}</p>}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {processing ? 'Menyimpan...' : (editingSubject ? <><Edit2 className="w-4 h-4" /> Simpan</> : <><Plus className="w-4 h-4" /> Tambah</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}