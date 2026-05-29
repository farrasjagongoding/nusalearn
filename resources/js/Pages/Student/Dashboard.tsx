import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Badge, Classroom, PageProps, QuizSession, StudentPoint } from '@/types';
import { 
    Star, 
    Shield, 
    Flame, 
    Award, 
    ChevronRight, 
    BookOpen, 
    Hash, 
    Send,
    PlayCircle,
    CheckCircle2
} from 'lucide-react';

interface Props {
    point: StudentPoint;
    recentSessions: (QuizSession & { created_at: string })[]; 
    badges: Badge[];
    classrooms: Classroom[];
    flash?: { success?: string };
}

export default function Dashboard({ point, recentSessions, badges, classrooms, flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({ invite_code: '' });
    const { auth } = usePage<PageProps>().props;
    
    const joinClassroom = (e: React.FormEvent) => {
        e.preventDefault();
        post('/student/classrooms/join', { onSuccess: () => reset() });
    };

    const xpNeeded   = point.level * 500;
    const xpProgress = Math.min(100, (point.experience / xpNeeded) * 100);

    const getPetStatus = () => {
        if (recentSessions.length === 0) {
            return {
                mood: 'Flat',
                img: '/images/pets/flat.png',
                message: 'Aku nungguin kamu ngerjain kuis pertamamu nih',
                color: 'bg-amber-50 border-amber-200 text-amber-700',
                bounce: 'animate-pulse'
            };
        }

        // Fungsi bantu untuk format tanggal ke YYYY-MM-DD sesuai zona waktu lokal perangkat
        const getLocalDateString = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const now = new Date();
        const todayStr = getLocalDateString(now);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);

        const lastSessionDate = new Date(recentSessions[0].created_at);
        const lastSessionStr = getLocalDateString(lastSessionDate);

        // 1. KONDISI HAPPY: Sudah mengerjakan kuis HARI INI
        if (lastSessionStr === todayStr) {
            return {
                mood: 'Happy',
                img: '/images/pets/happy.png',
                message: 'Yey! Streak kamu aman hari ini! Kamu hebat!',
                color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                bounce: 'animate-bounce'
            };
        } 
        
        // 2. KONDISI FLAT: Terakhir mengerjakan KEMARIN (Streak belum putus, tapi butuh dikerjakan hari ini)
        if (lastSessionStr === yesterdayStr) {
            return {
                mood: 'Flat',
                img: '/images/pets/flat.png',
                message: 'Jangan lupa ngerjain kuis hari ini biar aku nggak sedih!',
                color: 'bg-amber-50 border-amber-200 text-amber-700',
                bounce: 'animate-pulse' 
            };
        }

        // 3. KONDISI SAD: Terakhir mengerjakan SEBELUM KEMARIN (Bolong 1 hari penuh atau lebih -> Streak otomatis mati)
        return {
            mood: 'Sad',
            img: '/images/pets/sad.png',
            message: 'Huhu, aku sedih kamu bolong belajarnya',
            color: 'bg-rose-50 border-rose-200 text-rose-700',
            bounce: '' // Terdiam karena sedih
        };
    };

    const pet = getPetStatus();

    return (
        <StudentLayout point={point}>
            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {flash.success}
                </div>
            )}

            {/* HEADER & STREAK PET SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Kolom Kiri: Sapaan */}
                <div className="lg:col-span-2 bg-indigo-600 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute -right-10 -top-10 opacity-10">
                        <Star className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black tracking-tight mb-2">
                            Halo, {auth.user.name}! 👋
                        </h1>
                        <p className="text-indigo-200 font-medium text-lg">
                            Siap untuk petualangan belajarmu hari ini?
                        </p>
                    </div>
                </div>

                {/* Kolom Kanan: STREAK PET CARD */}
                <div className={`rounded-3xl p-6 border-2 shadow-sm flex flex-col items-center justify-center text-center transition-colors ${pet.color}`}>
                    <div className="relative w-28 h-28 mb-3">
                        {/* Shadow di bawah Pet */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/10 rounded-full blur-sm"></div>
                        {/* Gambar Pet */}
                        <img 
                            src={pet.img} 
                            alt={`Pet is ${pet.mood}`} 
                            className={`w-full h-full object-contain relative z-10 drop-shadow-md transition-all duration-500 hover:scale-110 ${pet.bounce}`} 
                        />
                    </div>
                    <h3 className="font-black tracking-tight mb-1">Streak Pet</h3>
                    <p className="text-xs font-bold opacity-80 leading-snug px-2">
                        {pet.message}
                    </p>
                </div>
            </div>

            {/* Stats Cards (Gamification Style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-200 hover:shadow-md transition">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-3">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{point.total_points}</div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Total Poin</div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">Lv.{point.level}</div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Level Saat Ini</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition">
                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-3">
                        <Flame className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{point.streak_days}</div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Hari Streak</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 hover:shadow-md transition">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-3">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-900">{badges.length}</div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Badge Diraih</div>
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
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
                <p className="text-xs font-medium text-slate-400 mt-3 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    Dapatkan {xpNeeded - point.experience} XP lagi untuk mencapai Level {point.level + 1}!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Kuis Terbaru */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-indigo-500" /> Kuis Terakhir
                        </h2>
                        <Link href="/student/quizzes" className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1 group">
                            Lihat Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        {recentSessions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-slate-400 text-sm font-medium">Belum ada kuis yang dikerjakan.</p>
                            </div>
                        ) : (
                            recentSessions.map((session) => {
                                const score = session.score ?? 0;
                                const isPassed = score >= 80;
                                const isAverage = score >= 60 && score < 80;

                                return (
                                    <div key={session.id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 line-clamp-1">{session.quiz?.title}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">{session.quiz?.subject?.name}</p>
                                        </div>
                                        <div className={`font-black text-sm px-3 py-1.5 rounded-lg border shadow-sm ${
                                            isPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : isAverage ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            {score}%
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Badge / Prestasi */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" /> Pencapaian Badge
                        </h2>
                        <Link href="/student/progress" className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1 group">
                            Koleksi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="flex-1">
                        {badges.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-slate-400 text-sm font-medium">Belum ada badge. Terus kerjakan kuis!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="group text-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition cursor-help" title={badge.description}>
                                        <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                                            {badge.icon}
                                        </div>
                                        <div className="text-xs text-slate-700 font-bold leading-tight">{badge.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kelas Saya */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-violet-500" /> Ruang Kelas Saya
                    </h2>
                    {classrooms.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-slate-400 text-sm font-medium">Belum bergabung ke kelas manapun.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {classrooms.map((cls) => (
                                <div key={cls.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition">
                                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shadow-inner">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{cls.name}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1">
                                            {cls.subject?.name} • Kelas {cls.grade}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gabung Kelas */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-indigo-600" /> Gabung Kelas Baru
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mb-6">
                        Masukkan kode undangan dari gurumu untuk mengakses kuis dan tugas eksklusif.
                    </p>
                    <form onSubmit={joinClassroom} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Hash className="w-5 h-5 text-slate-300" />
                            </div>
                            <input
                                type="text"
                                placeholder="X7K2-MTK8"
                                value={data.invite_code}
                                onChange={(e) => setData('invite_code', e.target.value.toUpperCase())}
                                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-center font-mono font-black text-xl tracking-[0.2em] uppercase text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm bg-white"
                            />
                        </div>
                        {errors.invite_code && (
                            <p className="text-rose-500 text-xs font-bold text-center">{errors.invite_code}</p>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> {processing ? 'Memverifikasi Kode...' : 'Gabung ke Kelas'}
                        </button>
                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}