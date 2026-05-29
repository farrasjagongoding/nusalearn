<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizSession;
use App\Models\StudentAnswer;
use App\Services\QuizScoringService;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizSessionController extends Controller
{
    public function __construct(
        protected QuizScoringService $scoringService,
        protected GamificationService $gamificationService,
    ) {}

    public function index()
    {
        $quizzes = Quiz::where('is_public', true)
                        ->where('is_active', true)
                        ->with('subject', 'chapter')
                        ->withCount('questions')
                        ->latest()->paginate(12);

        return Inertia::render('Student/Quiz/Index', ['quizzes' => $quizzes]);
    }

    public function start(Request $request, Quiz $quiz)
    {
        // Cek apakah sudah ada sesi yang sedang berjalan
        $existing = QuizSession::where('student_id', auth()->id())
                                ->where('quiz_id', $quiz->id)
                                ->where('status', 'in_progress')
                                ->first();

        if ($existing) {
            return redirect()->route('student.session.play', $existing);
        }

        $session = QuizSession::create([
            'student_id'   => auth()->id(),
            'quiz_id'      => $quiz->id,
            'classroom_id' => $request->classroom_id ?? null,
            'started_at'   => now(),
            'status'       => 'in_progress',
        ]);

        return redirect()->route('student.session.play', $session);
    }

    public function play(QuizSession $session)
    {
        abort_if($session->student_id !== auth()->id(), 403);
        abort_if($session->status !== 'in_progress', 403);

        $session->load('quiz.questions.options');

        return Inertia::render('Student/Quiz/Play', [
            'session'  => $session,
            'quiz'     => $session->quiz,
            'answers'  => $session->answers()->pluck('selected_option_id', 'question_id'),
        ]);
    }

    public function saveAnswer(Request $request, QuizSession $session)
    {
        abort_if($session->student_id !== auth()->id(), 403);

        $request->validate([
            'question_id'        => 'required|exists:questions,id',
            'selected_option_id' => 'nullable|exists:options,id',
        ]);

        StudentAnswer::updateOrCreate(
            ['session_id' => $session->id, 'question_id' => $request->question_id],
            ['selected_option_id' => $request->selected_option_id]
        );

        return response()->json(['success' => true]);
    }

    public function submit(QuizSession $session)
    {
        abort_if($session->student_id !== auth()->id(), 403);
        abort_if($session->status !== 'in_progress', 403);

        // Hitung skor
        $result = $this->scoringService->calculate($session);

        // Update sesi
        $session->update([
            'status'              => 'completed',
            'submitted_at'        => now(),
            'score'               => $result['score'],
            'duration_taken'      => now()->diffInSeconds($session->started_at),
            'total_points_earned' => $result['points_earned'],
        ]);

        // Proses gamifikasi
        $this->gamificationService->process($session);

        return redirect()->route('student.session.result', $session);
    }

    public function result(QuizSession $session)
    {
        abort_if($session->student_id !== auth()->id(), 403);

        $session->load('quiz.questions.options', 'answers.selectedOption');

        return Inertia::render('Student/Quiz/Result', [
            'session' => $session,
            'quiz'    => $session->quiz,
        ]);
    }
}