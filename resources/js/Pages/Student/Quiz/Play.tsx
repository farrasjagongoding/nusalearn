import { useForm } from '@inertiajs/react';
import { Quiz, QuizSession, Question } from '@/types';
import { useState, useEffect } from 'react';
import { 
    Clock, 
    AlertOctagon, 
    CheckCircle2, 
    ArrowRight, 
    Send,
    ListChecks,
    Star
} from 'lucide-react';

interface Props {
    session: QuizSession;
    quiz: Quiz & { questions: Question[] };
    answers: Record<number, number>;
}

export default function Play({ session, quiz, answers: initialAnswers }: Props) {
    const questions = quiz.questions ?? [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers ?? {});
    
    const currentQuestion = questions[currentIndex];

    // --- STATE WAKTU PER SOAL ---
    const [timeLeft, setTimeLeft] = useState(currentQuestion?.time_limit || 60);

    // State Anti-Cheat
    const [cheatCount, setCheatCount] = useState(0);
    const [showCheatWarning, setShowCheatWarning] = useState(false);

    const { post, processing } = useForm({});

    const submitQuiz = () => {
        post(`/student/session/${session.id}/submit`);
    };

    // --- EFEK TIMER TERPADU ---
    useEffect(() => {
        const initialTime = currentQuestion?.time_limit || 60;
        setTimeLeft(initialTime);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (currentIndex < questions.length - 1) {
                        setCurrentIndex((idx) => idx + 1);
                    } else {
                        submitQuiz();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, currentQuestion]);
    
    // --- EFEK ANTI-CHEAT Pindah Tab ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setCheatCount((prev) => {
                    const newCount = prev + 1;
                    fetch(`/student/session/${session.id}/report-cheat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '')
                        },
                        body: JSON.stringify({ cheat_count: newCount }),
                    });

                    if (newCount >= 3) {
                        alert("🚨 PELANGGARAN FATAL: Ujian dihentikan paksa karena indikasi kecurangan (pindah tab 3 kali).");
                        submitQuiz(); 
                    } else {
                        setShowCheatWarning(true); 
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const saveAnswer = (questionId: number, optionId: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
        fetch(`/student/session/${session.id}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: JSON.stringify({ question_id: questionId, selected_option_id: optionId }),
        });
    };

    const progressPercent = Math.round((currentIndex / questions.length) * 100);
    const isWarningTime = timeLeft <= 10;
    const isCautionTime = timeLeft <= 30 && timeLeft > 10;

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header Sticky */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="w-full bg-slate-100 h-1.5">
                    <div className="bg-indigo-500 h-1.5 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
                    <div className="hidden sm:block">
                        <h1 className="font-black text-slate-800 text-lg tracking-tight">{quiz.title}</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Sistem Anti-Cheat Aktif • Pengerjaan Linear</p>
                    </div>
                    <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-end gap-4">
                        {/* Timer Per Soal */}
                        <div className={`flex flex-col items-center sm:items-end px-4 py-1.5 rounded-xl border-2 transition-colors duration-300 ${
                            isWarningTime ? 'border-rose-500 bg-rose-50 text-rose-600 animate-pulse'
                            : isCautionTime ? 'border-amber-400 bg-amber-50 text-amber-600'
                            : 'border-indigo-100 bg-indigo-50 text-indigo-600'
                        }`}>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Sisa Waktu
                            </span>
                            <span className="font-mono font-black text-2xl leading-none tracking-tight">
                                {timeLeft} <span className="text-sm font-bold">dtk</span>
                            </span>
                        </div>
                        
                        <button onClick={submitQuiz} disabled={processing}
                            className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm flex items-center gap-2">
                            {processing ? 'Menyimpan...' : <><Send className="w-4 h-4" /> Kumpulkan</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 flex flex-col-reverse md:flex-row gap-6">
                {/* Panel Navigasi Soal (Hanya Lihat) */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 sticky top-28">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <ListChecks className="w-4 h-4" /> Peta Soal
                        </p>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {questions.map((q, i) => (
                                <div key={q.id} className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                    i === currentIndex ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110 z-10'
                                    : i < currentIndex 
                                        ? answers[q.id] ? 'bg-emerald-500 text-white shadow-sm' : 'bg-rose-400 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2.5 text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-sm bg-indigo-600" /> Sedang Dikerjakan</div>
                            <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> Tersimpan</div>
                            <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-sm bg-rose-400" /> Terlewat (Kosong)</div>
                        </div>
                    </div>
                </div>

                {/* Area Utama Soal */}
                <div className="flex-1">
                    {currentQuestion && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                                <span className="bg-indigo-50 text-indigo-700 text-sm font-black px-4 py-1.5 rounded-full border border-indigo-100 tracking-wide">
                                    Soal {currentIndex + 1} <span className="text-indigo-400 mx-1">/</span> {questions.length}
                                </span>
                                <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-current" /> {currentQuestion.points} Poin
                                </span>
                            </div>
                            
                            <p className="text-slate-800 text-lg sm:text-xl mb-10 leading-relaxed font-semibold">
                                {currentQuestion.content}
                            </p>

                            <div className="space-y-3 sm:space-y-4">
                                {currentQuestion.options?.map((option) => {
                                    const isSelected = answers[currentQuestion.id] === option.id;
                                    return (
                                        <button key={option.id} onClick={() => saveAnswer(currentQuestion.id, option.id)}
                                            className={`w-full text-left px-5 py-4 sm:py-5 rounded-2xl border-2 transition-all font-medium flex items-center gap-4 ${
                                                isSelected
                                                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 shadow-sm'
                                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                                            }`}>
                                            <span className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl font-black text-sm flex-shrink-0 transition-colors ${
                                                isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                                {option.label}
                                            </span>
                                            <span className="text-base leading-relaxed">{option.content}</span>
                                            {isSelected && <CheckCircle2 className="w-6 h-6 text-indigo-600 ml-auto flex-shrink-0" />}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
                                {currentIndex < questions.length - 1 ? (
                                    <button onClick={() => setCurrentIndex((prev) => prev + 1)}
                                        className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                                        Simpan & Lanjut <ArrowRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button onClick={submitQuiz} disabled={processing}
                                        className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" /> Selesai & Kumpulkan
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Anti-Cheat Premium */}
            {showCheatWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-rose-100">
                            <AlertOctagon className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Peringatan Sistem</h2>
                        <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                            Sistem keamanan mendeteksi Anda telah berpindah layar atau mengecilkan browser. Tindakan ini tercatat sebagai indikasi kecurangan.
                        </p>
                        <div className="bg-rose-50 text-rose-700 font-black tracking-widest text-sm py-2.5 px-4 rounded-xl inline-block mb-8 border border-rose-200 shadow-sm">
                            PELANGGARAN: {cheatCount} / 3
                        </div>
                        <button onClick={() => setShowCheatWarning(false)}
                            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-md">
                            Saya Mengerti, Lanjutkan Ujian
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}