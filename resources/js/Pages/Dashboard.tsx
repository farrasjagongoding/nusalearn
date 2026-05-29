import TeacherLayout from '@/Layouts/TeacherLayout';
import { Link } from '@inertiajs/react';
import { Quiz, Classroom } from '@/types';

interface Props {
    stats: {
        total_quizzes: number;
        total_classrooms: number;
        total_students: number;
        total_sessions: number;
    };
    recent_quizzes: Quiz[];
    classrooms: Classroom[];
    flash?: { success?: string };
}

export default function Dashboard({ stats, recent_quizzes, classrooms, flash }: Props) {
    return (
        <TeacherLayout>
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali!</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Kuis', value: stats.total_quizzes, color: 'bg-blue-600', icon: '📝' },
                    { label: 'Kelas Aktif', value: stats.total_classrooms, color: 'bg-green-600', icon: '🏫' },
                    { label: 'Total Siswa', value: stats.total_students, color: 'bg-purple-600', icon: '👨‍🎓' },
                    { label: 'Kuis Dikerjakan', value: stats.total_sessions, color: 'bg-orange-500', icon: '✅' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} text-white rounded-xl p-4`}>
                        <div className="text-3xl mb-1">{stat.icon}</div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kuis Terbaru */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-900">Kuis Terbaru</h2>
                        <Link href="/teacher/quizzes"
                            className="text-blue-600 text-sm hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    {recent_quizzes.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-sm mb-3">Belum ada kuis</p>
                            <Link href="/teacher/quizzes/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                                Buat Kuis Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recent_quizzes.map((quiz) => (
                                <div key={quiz.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{quiz.title}</p>
                                        <p className="text-xs text-gray-400">
                                            {quiz.subject?.name} • Bab {quiz.chapter?.name} • Kelas {quiz.grade}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        quiz.is_public
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {quiz.is_public ? 'Publik' : 'Privat'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Kelas Virtual */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-900">Kelas Virtual</h2>
                        <Link href="/teacher/classrooms"
                            className="text-blue-600 text-sm hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    {classrooms.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-sm mb-3">Belum ada kelas</p>
                            <Link href="/teacher/classrooms/create"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                                Buat Kelas Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {classrooms.map((cls) => (
                                <Link key={cls.id} href={`/teacher/classrooms/${cls.id}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                                            🏫
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-800">{cls.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {cls.subject?.name} • {cls.students_count} siswa
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                        {cls.invite_code}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}