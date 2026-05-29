import StudentLayout from '@/Layouts/StudentLayout';
import { Badge, StudentPoint } from '@/types';
import { 
    TrendingUp, 
    Target, 
    Award, 
    History, 
    BookOpen, 
    Star,
    CheckCircle2,
    AlertTriangle,
    PlusCircle
} from 'lucide-react';

interface SubjectStat {
    avg_score: number;
    count: number;
    total_points: number;
}

interface Props {
    point: StudentPoint;
    subjectStats: Record<string, SubjectStat>;
    badges: Badge[];
    pointHistory: { id: number; amount: number; reason: string; created_at: string }[];
    totalQuizzes: number;
    avgScore: number;
}

export default function Index({ point, subjectStats, badges, pointHistory, totalQuizzes, avgScore }: Props) {
    const xpNeeded = point.level * 500;
    const xpProgress = Math.min(100, (point.experience / xpNeeded) * 100);

    const getStatusStyle = (score: number) => {
        if (score >= 80) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500"/> };
        if (score >= 60) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-400', icon: <Target className="w-4 h-4 text-amber-500"/> };
        return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', bar: 'bg-rose-500', icon: <AlertTriangle className="w-4 h-4 text-rose-500"/> };
    };

    return (
        <StudentLayout point={point}>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-indigo-600" /> Progres Belajar
                </h1>
                <p className="text-slate-500 font-medium mt-1">Pantau perkembangan, statistik, dan pencapaianmu di sini.</p>
            </div>

            {/* Stats Gamification Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><Star className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black tracking-tight">{point.total_points}</div>
                        <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mt-1">Total Poin XP</div>
                    </div>
                </div>
                <div className="bg-violet-600 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><Target className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black tracking-tight">Lv.{point.level}</div>
                        <div className="text-violet-200 text-xs font-bold uppercase tracking-wider mt-1">Level Saat Ini</div>
                    </div>
                </div>
                <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><BookOpen className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black tracking-tight">{totalQuizzes}</div>
                        <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider mt-1">Kuis Selesai</div>
                    </div>
                </div>
                <div className="bg-amber-500 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><TrendingUp className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black tracking-tight">{avgScore}%</div>
                        <div className="text-amber-100 text-xs font-bold uppercase tracking-wider mt-1">Rata-rata Skor</div>
                    </div>
                </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Perjalanan Level</span>
                        <span className="font-black text-indigo-600 text-lg">Level {point.level}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-500">{point.experience} <span className="font-medium">/ {xpNeeded} XP</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
                <p className="text-xs font-medium text-slate-400 mt-3 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    Kumpulkan {xpNeeded - point.experience} XP lagi untuk naik tingkat!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Performa Per Mapel */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Target className="w-5 h-5 text-indigo-500" /> Performa Mata Pelajaran
                    </h2>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {Object.keys(subjectStats).length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                                <Target className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm font-medium">Belum ada data evaluasi. Kerjakan kuis dulu!</p>
                            </div>
                        ) : (
                            Object.entries(subjectStats).map(([subject, stat]) => {
                                const style = getStatusStyle(stat.avg_score);
                                return (
                                    <div key={subject} className={`p-4 rounded-xl border ${style.bg} ${style.border}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-slate-800 block text-sm">{subject}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.count} Kuis Selesai</span>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border ${style.border} text-xs font-black shadow-sm ${style.text}`}>
                                                {style.icon} {stat.avg_score}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-white/60 rounded-full h-2.5 shadow-inner overflow-hidden">
                                                <div className={`h-full rounded-full transition-all ${style.bar}`} style={{ width: `${stat.avg_score}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Badge Galeri */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" /> Galeri Badge
                        </h2>
                        <span className="bg-amber-50 text-amber-600 text-xs font-black px-3 py-1 rounded-full border border-amber-100">
                            {badges.length} Diraih
                        </span>
                    </div>
                    
                    <div className="flex-1">
                        {badges.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                                <Award className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm font-medium">Koleksimu masih kosong. Ayo kejar prestasinya!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="group text-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm transition cursor-help" title={badge.description}>
                                        <div className="w-14 h-14 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mb-3 border border-slate-100 group-hover:scale-110 transition-transform">
                                            {badge.icon}
                                        </div>
                                        <div className="text-xs text-slate-800 font-bold leading-tight">{badge.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Riwayat Poin XP */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <History className="w-5 h-5 text-indigo-500" /> Riwayat Transaksi Poin
                </h2>
                
                {pointHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-400 text-sm font-medium">Belum ada riwayat poin yang terekam.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {pointHistory.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center py-3 border-b border-slate-50 hover:bg-slate-50 px-3 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <PlusCircle className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <p className="text-sm text-slate-800 font-bold">{tx.reason}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                            {new Date(tx.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 font-black text-sm">
                                    +{tx.amount} XP
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}