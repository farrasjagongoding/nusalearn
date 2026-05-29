import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    GraduationCap, 
    BookOpen, 
    FileText, 
    Activity, 
    Server, 
    Database, 
    Clock, 
    CheckCircle2, 
    AlertCircle 
} from 'lucide-react';

interface ActivityLog {
    id: string;
    title: string;
    time: string;
    icon: string;
}

interface Props {
    auth: { user: { name: string } };
    stats: {
        users: number;
        teachers: number;
        students: number;
        quizzes: number;
        subjects: number;
    };
    recentActivities: ActivityLog[];
    storageSpace: number;
}

export default function Dashboard({ auth, stats, recentActivities = [], storageSpace = 0 }: Props) {
    
    // Fallback data agar tidak error jika penamaan dari controller sedikit berbeda
    const totalUsers = stats?.users ?? 0;
    const totalTeachers = stats?.teachers ?? 0;
    const totalStudents = stats?.students ?? 0;
    const totalQuizzes = stats?.quizzes ?? 0;
    const totalSubjects = stats?.subjects ?? 0;

    const statCards = [
        { title: 'Total Pengguna', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Guru Pengajar', value: totalTeachers, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Siswa Terdaftar', value: totalStudents, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
        { title: 'Total Kuis', value: totalQuizzes, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Mata Pelajaran', value: totalSubjects, icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Halo, {auth?.user?.name}! 👋</h1>
                <p className="text-slate-500 mt-2 font-medium">Berikut adalah ringkasan aktivitas NusaLearn hari ini.</p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Aktivitas Terbaru */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" /> Aktivitas Terbaru
                        </h2>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-sm">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                                <Clock className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm font-medium">Belum ada aktivitas terbaru.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Server */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-slate-600" /> Status Server
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Storage */}
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-bold">
                                <span className="text-slate-600">Penyimpanan Proyek</span>
                                <span className={storageSpace > 85 ? 'text-rose-600' : 'text-slate-900'}>{storageSpace}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${storageSpace > 85 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                    style={{ width: `${storageSpace}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Database */}
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-bold">
                                <span className="text-slate-600">Koneksi Database</span>
                                <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Stabil</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full w-full"></div>
                            </div>
                        </div>

                        {/* System Message */}
                        <div className={`mt-8 p-4 rounded-xl border ${storageSpace > 85 ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
                            <div className="flex items-start gap-3">
                                {storageSpace > 85 ? (
                                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                ) : (
                                    <Database className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                )}
                                <p className={`text-xs font-bold leading-relaxed ${storageSpace > 85 ? 'text-rose-800' : 'text-indigo-800'}`}>
                                    {storageSpace > 85 
                                        ? 'Peringatan: Kapasitas penyimpanan server hampir penuh. Harap lakukan pembersihan.' 
                                        : 'Sistem berjalan optimal. API dan integrasi database merespons dengan normal.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}