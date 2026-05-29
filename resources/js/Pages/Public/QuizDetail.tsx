import { Link, usePage } from '@inertiajs/react';
import { PageProps, Quiz } from '@/types';

interface Props {
    quiz: Quiz;
}

export default function QuizDetail({ quiz }: Props) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600">NusaLearn</Link>
                    <Link href="/browse" className="text-gray-600 hover:text-blue-600 text-sm">
                        ← Kembali ke Daftar Kuis
                    </Link>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{quiz.subject?.icon}</span>
                        <div>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                                {quiz.level} • Kelas {quiz.grade}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>

                    {quiz.description && (
                        <p className="text-gray-500 mb-6">{quiz.description}</p>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <div className="text-xl font-bold text-gray-800">
                                {quiz.questions?.length ?? 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Soal</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <div className="text-xl font-bold text-gray-800">{quiz.duration}</div>
                            <div className="text-xs text-gray-400 mt-1">Menit</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <div className="text-xl font-bold text-gray-800">
                                {quiz.subject?.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{quiz.chapter?.name}</div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-6">
                        Dibuat oleh: <span className="font-medium text-gray-600">{quiz.teacher?.name}</span>
                    </p>

                    {auth?.user ? (
                        <Link
                            href={`/student/quizzes/${quiz.id}/start`}
                            method="post"
                            as="button"
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center block"
                        >
                            Mulai Kuis Sekarang 🚀
                        </Link>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-center text-sm text-gray-500">
                                Daftar atau masuk untuk mengerjakan kuis ini
                            </p>
                            <div className="flex gap-3">
                                <Link href="/register"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center">
                                    Daftar Gratis
                                </Link>
                                <Link href="/login"
                                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-center">
                                    Masuk
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
