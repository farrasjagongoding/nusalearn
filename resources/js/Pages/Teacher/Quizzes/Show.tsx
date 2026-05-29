import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Quiz, PageProps, Question } from '@/types';
import { 
    Download, 
    Upload, 
    Settings, 
    Plus, 
    Edit2, 
    Trash2, 
    Clock, 
    Star, 
    CheckCircle2, 
    Lightbulb, 
    X, 
    FileQuestion,
    Save,
    ChevronLeft
} from 'lucide-react';

interface Props extends PageProps {
    quiz: Quiz & { questions?: Question[] };
}

export default function Show({ quiz, flash }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        content: '',
        type: 'multiple_choice',
        explanation: '',
        points: 10,
        time_limit: 60,
        options: [
            { label: 'A', content: '', is_correct: true },
            { label: 'B', content: '', is_correct: false },
            { label: 'C', content: '', is_correct: false },
            { label: 'D', content: '', is_correct: false },
        ],
    });

    const importForm = useForm({
        file: null as File | null,
    });

    const setCorrect = (index: number) => {
        const updated = data.options.map((o, i) => ({ ...o, is_correct: i === index }));
        setData('options', updated);
    };

    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        setData({
            content: question.content,
            type: question.type || 'multiple_choice',
            explanation: question.explanation || '',
            points: question.points || 10,
            time_limit: question.time_limit || 60,
            options: question.options && question.options.length > 0 
                ? question.options 
                : [
                    { label: 'A', content: '', is_correct: true },
                    { label: 'B', content: '', is_correct: false },
                    { label: 'C', content: '', is_correct: false },
                    { label: 'D', content: '', is_correct: false },
                  ],
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingQuestion(null);
        reset();
    };

    const submitQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingQuestion) {
            put(`/teacher/questions/${editingQuestion.id}`, { onSuccess: () => handleCancel() });
        } else {
            post(`/teacher/quizzes/${quiz.id}/questions`, { onSuccess: () => handleCancel() });
        }
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        importForm.post(`/teacher/quizzes/${quiz.id}/import`, {
            onSuccess: () => {
                setShowImportModal(false);
                importForm.reset();
            }
        });
    };

    const deleteQuestion = (questionId: number) => {
        if (confirm('Hapus soal ini secara permanen?')) {
            router.delete(`/teacher/questions/${questionId}`);
        }
    };

    return (
        <TeacherLayout>
            <Head title={`Detail Kuis: ${quiz.title}`} />
            
            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {flash.success}
                </div>
            )}

            {/* Header Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <Link href="/teacher/quizzes" className="inline-flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-indigo-600 transition mb-3">
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{quiz.title}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{quiz.subject?.name}</span>
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">Kelas {quiz.grade} {quiz.level}</span>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {quiz.duration} Menit
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition">
                            <Download className="w-4 h-4" /> Import CSV
                        </button>
                        <a href={`/teacher/quizzes/${quiz.id}/export`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition">
                            <Upload className="w-4 h-4" /> Export CSV
                        </a>
                        <Link href={`/teacher/quizzes/${quiz.id}/edit`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-bold transition">
                            <Settings className="w-4 h-4" /> Pengaturan
                        </Link>
                        <button onClick={() => { handleCancel(); setShowForm(true); }}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-sm transition">
                            <Plus className="w-4 h-4" /> Tambah Soal
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Import CSV */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-black text-slate-900">Import Soal (CSV)</h2>
                            <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-6">Upload file CSV untuk menambahkan banyak soal sekaligus. Gunakan template agar formatnya sesuai.</p>
                        
                        <a href="/teacher/quizzes/template-csv" className="flex items-center justify-center gap-2 w-full py-2.5 mb-6 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition">
                            <Download className="w-4 h-4" /> Download Template CSV
                        </a>

                        <form onSubmit={submitImport}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Pilih File CSV (.csv)</label>
                                <input 
                                    type="file" 
                                    accept=".csv"
                                    onChange={e => importForm.setData('file', e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl" 
                                />
                                {importForm.errors.file && <p className="text-rose-500 text-xs mt-2 font-medium">{importForm.errors.file}</p>}
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowImportModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                                    Batal
                                </button>
                                <button type="submit" disabled={importForm.processing || !importForm.data.file}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Upload className="w-4 h-4" /> {importForm.processing ? 'Memproses...' : 'Upload Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Form Tambah/Edit Soal Manual */}
            {showForm && (
                <div className={`rounded-2xl p-6 shadow-md border mb-8 transition-all ${editingQuestion ? 'bg-amber-50/50 border-amber-200' : 'bg-indigo-50/30 border-indigo-200'}`}>
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-200/50 pb-4">
                        {editingQuestion ? <Edit2 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                        <h2 className="text-lg font-black text-slate-800">
                            {editingQuestion ? 'Edit Data Soal' : 'Buat Soal Baru'}
                        </h2>
                    </div>
                    
                    <form onSubmit={submitQuestion} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Isi Pertanyaan</label>
                            <textarea value={data.content} onChange={(e) => setData('content', e.target.value)} rows={3}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-800 font-medium transition" required placeholder="Ketik pertanyaan di sini..." />
                            {errors.content && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.content}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Bobot Poin</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Star className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input type="number" 
                                        value={data.points === 0 ? '' : data.points} 
                                        onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-bold text-slate-800 transition" min="1" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Waktu Pengerjaan (Detik)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input type="number" 
                                        value={data.time_limit === 0 ? '' : data.time_limit} 
                                        onChange={(e) => setData('time_limit', parseInt(e.target.value) || 0)}
                                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-bold text-slate-800 transition" min="5" placeholder="Misal: 60" required />
                                </div>
                                {errors.time_limit && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.time_limit}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                                Pilihan Ganda <span className="text-slate-400 font-medium normal-case tracking-normal ml-1">(Klik huruf untuk memilih kunci jawaban)</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {data.options.map((opt, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-2 rounded-xl border transition ${opt.is_correct ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                                        <button type="button" onClick={() => setCorrect(i)}
                                            className={`w-10 h-10 rounded-lg font-black text-sm flex items-center justify-center flex-shrink-0 transition-all ${
                                                opt.is_correct ? 'bg-emerald-500 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}>
                                            {opt.label}
                                        </button>
                                        <input type="text" value={opt.content} required
                                            onChange={(e) => {
                                                const updated = [...data.options];
                                                updated[i].content = e.target.value;
                                                setData('options', updated);
                                            }}
                                            placeholder={`Opsi ${opt.label}...`}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 p-0 placeholder-slate-400 outline-none" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Pembahasan Singkat (Opsional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <Lightbulb className="w-4 h-4 text-slate-400" />
                                </div>
                                <textarea value={data.explanation} onChange={(e) => setData('explanation', e.target.value)} rows={2}
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium bg-white text-slate-800 transition" placeholder="Jelaskan mengapa jawaban tersebut benar..." />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-200/50">
                            <button type="submit" disabled={processing}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-sm transition disabled:opacity-50 ${
                                    editingQuestion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}>
                                <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : (editingQuestion ? 'Simpan Perubahan' : 'Simpan Soal')}
                            </button>
                            <button type="button" onClick={handleCancel}
                                className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white bg-slate-50 transition">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Soal */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-800">Daftar Soal</h2>
                    <span className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1 rounded-full">Total: {quiz.questions?.length ?? 0}</span>
                </div>

                {(quiz.questions?.length ?? 0) === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <FileQuestion className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium text-sm">Belum ada soal pada kuis ini.</p>
                    </div>
                ) : (
                    quiz.questions?.map((question, i) => (
                        <div key={question.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black border border-indigo-100">
                                        {i + 1}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><Clock className="w-3.5 h-3.5" /> {question.time_limit}s</span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100"><Star className="w-3.5 h-3.5 fill-current" /> {question.points} Poin</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(question)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold transition border border-slate-100 hover:border-indigo-100">
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => deleteQuestion(question.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition border border-slate-100 hover:border-rose-100">
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-800 font-semibold text-lg mb-5 leading-relaxed">{question.content}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {question.options?.map((opt, idx) => (
                                    <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                                        opt.is_correct ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                            opt.is_correct ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {opt.label}
                                        </span>
                                        <span className={`text-sm font-medium mt-0.5 ${opt.is_correct ? 'text-emerald-800' : 'text-slate-600'}`}>
                                            {opt.content}
                                        </span>
                                        {opt.is_correct && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" />}
                                    </div>
                                ))}
                            </div>

                            {question.explanation && (
                                <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-black text-indigo-800 uppercase tracking-wider mb-1">Pembahasan</span>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{question.explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </TeacherLayout>
    );
}