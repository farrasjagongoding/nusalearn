import { Link } from '@inertiajs/react';
import { Quiz, QuizSession } from '@/types';
import { 
    Trophy, 
    Target, 
    Zap, 
    CheckCircle2, 
    XCircle, 
    ArrowLeft, 
    BookOpen,
    Lightbulb
} from 'lucide-react';

interface Props {
    session: QuizSession;
    quiz: Quiz;
}

export default function Result({ session, quiz }: Props) {
    const score = session.score ?? 0;
    const correct = session.answers?.filter((a) => a.is_correct).length ?? 0;
    const total = quiz.questions?.length ?? 0;

    const getScoreStyle = () => {
        if (score >= 80) return { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <Trophy className="w-16 h-16 text-emerald-500" /> };
        if (score >= 60) return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Target className="w-16 h-16 text-amber-500" /> };
        return { text: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', icon: <Zap className="w-16 h-16 text-rose-500" /> };
    };

    const style = getScoreStyle();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full">
                {/* Hasil Utama */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 text-center mb-8 relative overflow-hidden">
                    {/* Confetti / Glow Effect Background */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-40 rounded-full ${style.bg}`} />
                    
                    <div className="relative z-10">
                        <div className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-6 border border-slate-100">
                            {style.icon}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Kuis Selesai!</h1>
                        <p className="text-slate-500 font-medium mb-8 bg-slate-50 inline-block px-4 py-1.5 rounded-lg border border-slate-100">{quiz.title}</p>

                        <div className="flex flex-col items-center justify-center mb-10">
                            <span className={`text-8xl font-black tracking-tighter leading-none ${style.text}`}>
                                {score}
                            </span>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2">Skor Akhir</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 transition-transform hover:scale-105">
                                <div className="text-2xl font-black text-emerald-600 mb-1">{correct}</div>
                                <div className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-wider">Jawaban Benar</div>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 transition-transform hover:scale-105">
                                <div className="text-2xl font-black text-rose-500 mb-1">{total - correct}</div>
                                <div className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider">Jawaban Salah</div>
                            </div>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 transition-transform hover:scale-105">
                                <div className="text-2xl font-black text-indigo-600 mb-1">+{session.total_points_earned}</div>
                                <div className="text-[10px] sm:text-xs font-bold text-indigo-500 uppercase tracking-wider">XP Diperoleh</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link href="/student/dashboard"
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">
                                <ArrowLeft className="w-5 h-5" /> Kembali ke Dashboard
                            </Link>
                            <Link href="/student/quizzes"
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition">
                                <BookOpen className="w-5 h-5" /> Eksplor Kuis Lain
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pembahasan */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Lightbulb className="w-6 h-6 text-amber-500 fill-amber-100" /> Kunci & Pembahasan
                    </h2>
                    
                    <div className="space-y-6">
                        {quiz.questions?.map((question, i) => {
                            const answer = session.answers?.find((a) => a.question_id === question.id);
                            const isCorrect = answer?.is_correct;

                            return (
                                <div key={question.id} className={`p-5 rounded-2xl border-l-4 shadow-sm ${
                                    isCorrect ? 'bg-emerald-50/50 border-emerald-500 border-y-emerald-50 border-r-emerald-50' 
                                              : 'bg-rose-50/50 border-rose-500 border-y-rose-50 border-r-rose-50'
                                }`}>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-0.5">
                                            {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 text-base mb-4 leading-relaxed">
                                                {i + 1}. {question.content}
                                            </p>
                                            
                                            <div className="space-y-2 mb-4">
                                                {question.options?.map((opt) => (
                                                    <div key={opt.id} className={`text-sm px-4 py-2.5 rounded-xl flex items-center gap-3 border transition-colors ${
                                                        opt.is_correct
                                                            ? 'bg-emerald-100/50 border-emerald-200 text-emerald-800 font-bold'
                                                            : answer?.selected_option_id === opt.id && !opt.is_correct
                                                            ? 'bg-rose-100/50 border-rose-200 text-rose-800 font-bold'
                                                            : 'bg-white border-slate-200 text-slate-500'
                                                    }`}>
                                                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${
                                                            opt.is_correct ? 'bg-emerald-500 text-white' 
                                                            : answer?.selected_option_id === opt.id && !opt.is_correct ? 'bg-rose-500 text-white'
                                                            : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                            {opt.label}
                                                        </span>
                                                        <span className="flex-1">{opt.content}</span>
                                                        {opt.is_correct && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                                        {answer?.selected_option_id === opt.id && !opt.is_correct && <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                            </div>

                                            {question.explanation && (
                                                <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                                                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Penjelasan Singkat</span>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}