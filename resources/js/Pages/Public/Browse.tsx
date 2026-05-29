import { Link, usePage } from '@inertiajs/react';
import { PageProps, Quiz, Subject } from '@/types';
import { useState } from 'react';

interface Props {
    quizzes: { data: Quiz[] };
    subjects: Subject[];
    filters: { subject_id?: string; level?: string; grade?: string; search?: string };
}

export default function Browse({ quizzes, subjects, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold text-blue-600">NusaLearn</Link>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link href="/dashboard"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Masuk</Link>
                                    <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Daftar</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Jelajahi Kuis</h1>
                    <p className="text-gray-500 mt-2">Latihan soal dari guru-guru terbaik seluruh Indonesia</p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            placeholder="Cari kuis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <Link
                            href={`/browse?search=${search}`}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Cari
                        </Link>
                    </div>

                    {/* Filter Jenjang */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {['', 'SD', 'SMP', 'SMA'].map((level) => (
                            <Link
                                key={level}
                                href={`/browse?level=${level}`}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                                    filters.level === level || (!filters.level && level === '')
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {level || 'Semua'}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quiz Grid */}
                {quizzes.data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-gray-500">Tidak ada kuis ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizzes.data.map((quiz) => (
                            <div key={quiz.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">{quiz.subject?.icon}</span>
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                        {quiz.level} Kelas {quiz.grade}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{quiz.title}</h3>
                                <p className="text-sm text-gray-400 mb-3">
                                    {quiz.subject?.name} • {quiz.chapter?.name}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>📝 {quiz.questions_count} soal</span>
                                        <span>⏱ {quiz.duration} menit</span>
                                    </div>
                                    {auth?.user ? (
                                        <Link
                                            href={`/student/quizzes`}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                        >
                                            Kerjakan
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/register"
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                        >
                                            Daftar dulu
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}