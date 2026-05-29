import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    BookOpen, 
    ArrowRight, 
    Compass, 
    LayoutDashboard, 
    LogIn, 
    UserPlus,
    Target,
    Users,
    GraduationCap,
    CheckCircle2
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            
            {/* --- NAVBAR --- */}
            <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-slate-900 text-lg sm:text-xl font-black tracking-tight">NusaLearn</span>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/browse" className="hidden md:inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-bold text-sm transition">
                            <Compass className="w-4 h-4" /> Jelajahi Kuis
                        </Link>
                        
                        {auth?.user ? (
                            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm transition">
                                <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard Saya</span>
                                <span className="sm:hidden">Dashboard</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-bold text-xs sm:text-sm transition">
                                    <LogIn className="w-4 h-4" /> Masuk
                                </Link>
                                <Link href="/register" className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-800 shadow-sm transition">
                                    <UserPlus className="w-4 h-4" /> Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Kolom Kiri: Teks & CTA */}
                <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Sistem Ujian Berintegritas
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight px-2 sm:px-0">
                        Revolusi Edukasi Digital Berbasis <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600">
                            Kolaborasi.
                        </span>
                    </h1>
                    
                    <p className="text-slate-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0">
                        Platform EdTech Premium untuk Siswa & Guru SD hingga SMA. Bangun komunitas belajar lintas sekolah dengan sistem ujian linear, pengawasan anti-cheat, dan gamifikasi interaktif.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-2 px-6 sm:px-0">
                        <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Mulai Petualangan <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/browse" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            <Compass className="w-5 h-5" /> Kuis Publik
                        </Link>
                    </div>
                </div>

                {/* Kolom Kanan: BUKU 3D CLEAN & ELEGANT */}
                <div className="lg:col-span-6 flex justify-center items-center min-h-[350px] sm:min-h-[450px] relative pointer-events-none">
                    <div className="absolute transform scale-[0.65] sm:scale-[0.85] lg:scale-100 flex justify-center items-center">
                        <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-indigo-200"
                             style={{ transform: 'rotateX(60deg) rotateY(-20deg)', animation: 'hudOrbit 20s infinite linear' }} />
                        <div className="absolute w-[280px] h-[280px] rounded-full border border-indigo-100"
                             style={{ transform: 'rotateX(60deg) rotateY(10deg)', animation: 'hudOrbitClockwise 15s infinite linear' }} />
                        <div className="relative w-[340px] h-[440px]" style={{ perspective: '1500px' }}>
                            <div className="w-full h-full relative preserve-3d" style={{ transformStyle: 'preserve-3d', animation: 'rotateBook 14s infinite linear, floatBook 4s infinite ease-in-out' }}>
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(99,102,241,0.15)] flex flex-col items-center justify-center border border-white border-r-indigo-100 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(25px)' }}>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-transparent rounded-2xl"></div>
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6">
                                            <BookOpen className="w-14 h-14 text-white" strokeWidth={1.5} />
                                        </div>
                                        <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4">NusaLearn</h2>
                                        <div className="h-1.5 w-16 bg-indigo-600 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                                <div className="absolute top-0 bottom-0 right-0 bg-slate-100/90 backdrop-blur-md border-y border-slate-200 shadow-inner" style={{ width: '50px', transform: 'rotateY(90deg) translateZ(145px) translateX(25px)', transformOrigin: 'right center', backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.03) 50%)', backgroundSize: '4px 10px' }} />
                                <div className="absolute inset-0 bg-slate-200 rounded-2xl border border-slate-300" style={{ transform: 'rotateY(180deg) translateZ(25px)' }} />
                            </div>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-indigo-900/10 rounded-full blur-xl" style={{ animation: 'shadowPulse 4s infinite ease-in-out' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STATS SECTION (BENTO GRID STYLE) --- */}
            <div className="relative z-10 py-16 sm:py-24 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { icon: <Target className="w-8 h-8" />, label: 'Kuis Tersedia', value: 'Ribuan', color: 'text-indigo-600', bg: 'bg-indigo-50', gradient: 'from-indigo-600 to-violet-600' },
                            { icon: <Users className="w-8 h-8" />, label: 'Guru & Siswa Aktif', value: 'Ratusan', color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-500' },
                            { icon: <GraduationCap className="w-8 h-8" />, label: 'Jenjang Pendidikan', value: 'SD - SMA', color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-500 to-orange-500' },
                        ].map((stat, idx) => (
                            <div key={idx} className="group relative bg-white rounded-[2rem] p-8 text-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                
                                {/* Aksen Cahaya di Belakang Card (Muncul saat Hover) */}
                                <div className={`absolute -inset-4 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`}></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 font-bold uppercase tracking-widest text-xs sm:text-sm mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ANIMASI MURNI CSS --- */}
            <style>{`
                @keyframes rotateBook {
                    0% { transform: rotateY(-20deg) rotateX(10deg); }
                    50% { transform: rotateY(20deg) rotateX(15deg); }
                    100% { transform: rotateY(-20deg) rotateX(10deg); }
                }
                @keyframes floatBook {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes hudOrbit {
                    from { transform: rotateX(60deg) rotateY(-20deg) rotateZ(0deg); }
                    to { transform: rotateX(60deg) rotateY(-20deg) rotateZ(360deg); }
                }
                @keyframes hudOrbitClockwise {
                    from { transform: rotateX(60deg) rotateY(10deg) rotateZ(360deg); }
                    to { transform: rotateX(60deg) rotateY(10deg) rotateZ(0deg); }
                }
                @keyframes shadowPulse {
                    0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
                    50% { transform: translateX(-50%) scale(0.85); opacity: 0.4; }
                    100% { transform: translateX(-50%) scale(1); opacity: 0.8; }
                }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
}