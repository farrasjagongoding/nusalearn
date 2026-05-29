import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { router, Head } from '@inertiajs/react';
import { PageProps, Quiz, StudentPoint } from '@/types';
import { 
    BookOpen, 
    Clock, 
    Layers, 
    PlayCircle, 
    ShieldAlert, 
    CheckCircle2, 
    ArrowRight 
} from 'lucide-react';

interface Props {
    quizzes: { data: Quiz[] };
    point?: StudentPoint;
}

export default function Index({ quizzes, point }: Props) {
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);

    const handleStartQuiz = () => {
        if (selectedQuiz) {
            router.post(`/student/quizzes/${selectedQuiz.id}/start`);
        }
    };

    return (
        <StudentLayout point={point}>
            <Head title="Eksplorasi Kuis" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Eksplorasi Kuis</h1>
                <p className="text-slate-500 font-medium mt-1">Uji kemampuanmu dengan menyelesaikan kuis yang tersedia.</p>
            </div>

            {quizzes.data.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                    <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Kuis Tersedia</h3>
                    <p className="text-slate-500 text-sm font-medium">Tunggu gurumu merilis kuis baru, atau cek kode undangan kelasmu.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {quizzes.data.map((quiz) => (
                        <div key={quiz.id} className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                    {quiz.level} • Kls {quiz.grade}
                                </span>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {quiz.title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mb-1">{quiz.subject?.name || 'Umum'}</p>
                                <p className="text-xs text-slate-400 mb-5">{quiz.chapter?.name}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {quiz.questions_count} Soal</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {quiz.duration} Menit</span>
                                </div>
                                
                                <button
                                    onClick={() => { 
                                        setSelectedQuiz(quiz); 
                                        setIsAgreed(false); 
                                    }}
                                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-1.5"
                                >
                                    <PlayCircle className="w-4 h-4" /> Mulai
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL PAKTA INTEGRITAS --- */}
            {selectedQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl transform transition-all relative overflow-hidden">
                        
                        {/* Dekorasi Latar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>

                        <div className="text-center mb-6 pt-2">
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Persiapan Ujian</h2>
                            <p className="text-slate-500 text-sm font-medium mt-2">
                                Anda akan memulai kuis:
                            </p>
                            <p className="font-bold text-slate-800 bg-slate-50 p-2 rounded-lg mt-2 text-sm border border-slate-100">
                                {selectedQuiz.title}
                            </p>
                        </div>

                        <div className={`border-2 rounded-xl p-4 mb-8 transition-colors cursor-pointer ${isAgreed ? 'bg-indigo-50/50 border-indigo-500' : 'bg-slate-50 border-slate-200'}`}
                             onClick={() => setIsAgreed(!isAgreed)}>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 relative flex items-center justify-center">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAgreed ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                        {isAgreed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-700 leading-relaxed select-none">
                                    Saya berjanji mengerjakan kuis ini dengan jujur, tidak membuka tab browser lain, dan <span className="text-rose-600 font-black">tidak menggunakan bantuan AI</span> dalam bentuk apa pun.
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedQuiz(null)}
                                className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleStartQuiz}
                                disabled={!isAgreed}
                                className={`flex-1 px-4 py-3.5 font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                                    isAgreed 
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Mulai Kerjakan <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}