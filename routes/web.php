<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Teacher;
use App\Http\Controllers\Student;
use App\Http\Controllers\Public as PublicController;

Route::get('/', function () {
    return inertia('Welcome');
})->name('home');

Route::get('/browse', [PublicController\QuizBrowserController::class, 'index'])->name('quiz.browse');
Route::get('/browse/{quiz}', [PublicController\QuizBrowserController::class, 'show'])->name('quiz.show');

require __DIR__.'/auth.php';

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', Admin\UserController::class);
        Route::resource('subjects', Admin\SubjectController::class);
    });

Route::middleware(['auth', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', [Teacher\DashboardController::class, 'index'])->name('dashboard');

        Route::get('quizzes/template-csv', [Teacher\QuizController::class, 'downloadTemplate'])->name('quizzes.template');
        // Kuis
        Route::resource('quizzes', Teacher\QuizController::class);
        Route::post('quizzes/{quiz}/questions', [Teacher\QuizController::class, 'storeQuestion'])->name('quizzes.questions.store');
        Route::put('questions/{question}', [Teacher\QuizController::class, 'updateQuestion'])->name('questions.update'); 
        Route::delete('questions/{question}', [Teacher\QuizController::class, 'destroyQuestion'])->name('questions.destroy');

        // <--- TAMBAHAN BARU: RUTE IMPORT / EXPORT CSV --->
        Route::post('quizzes/{quiz}/import', [Teacher\QuizController::class, 'importCsv'])->name('quizzes.import');
        Route::get('quizzes/{quiz}/export', [Teacher\QuizController::class, 'exportCsv'])->name('quizzes.export');

        // Kelas Virtual
        Route::resource('classrooms', Teacher\ClassroomController::class);
        Route::post('classrooms/{classroom}/assign-quiz', [Teacher\ClassroomController::class, 'assignQuiz'])->name('classrooms.assign-quiz');
        Route::delete('classrooms/{classroom}/students/{student}', [Teacher\ClassroomController::class, 'removeStudent'])->name('classrooms.students.remove');

        // Analitik
        Route::get('analytics/{classroom}', [Teacher\AnalyticsController::class, 'show'])->name('analytics.show');
    });

Route::middleware(['auth', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', [Student\DashboardController::class, 'index'])->name('dashboard');

        // Kuis
        Route::get('/quizzes', [Student\QuizSessionController::class, 'index'])->name('quizzes.index');
        Route::post('/quizzes/{quiz}/start', [Student\QuizSessionController::class, 'start'])->name('quizzes.start');
        Route::get('/session/{session}/play', [Student\QuizSessionController::class, 'play'])->name('session.play');
        Route::post('/session/{session}/answer', [Student\QuizSessionController::class, 'saveAnswer'])->name('session.answer');
        Route::post('/session/{session}/submit', [Student\QuizSessionController::class, 'submit'])->name('session.submit');
        Route::get('/session/{session}/result', [Student\QuizSessionController::class, 'result'])->name('session.result');

        // Kelas
        Route::post('/classrooms/join', [Student\DashboardController::class, 'joinClassroom'])->name('classrooms.join');

        // Progres & Badge
        Route::get('/progress', [Student\ProgressController::class, 'index'])->name('progress');
    });

Route::middleware('auth')->get('/dashboard', function () {
    $role = auth()->user()->role;
    return match($role) {
        'admin'   => redirect()->route('admin.dashboard'),
        'teacher' => redirect()->route('teacher.dashboard'),
        'student' => redirect()->route('student.dashboard'),
        default   => redirect()->route('home'),
    };
})->name('dashboard');