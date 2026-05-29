<?php

namespace App\Services;

use App\Models\QuizSession;
use App\Models\StudentAnswer;
use App\Models\User;

class AnalyticsService
{
    // Analitik performa siswa per topik/bab
    public function getStudentTopicStats(int $studentId): array
    {
        $sessions = QuizSession::where('student_id', $studentId)
                                ->where('status', 'completed')
                                ->with('quiz.chapter', 'quiz.subject')
                                ->get();

        return $sessions->groupBy('quiz.chapter.name')
            ->map(fn($s) => [
                'chapter'     => $s->first()->quiz->chapter->name ?? 'Umum',
                'subject'     => $s->first()->quiz->subject->name ?? '-',
                'avg_score'   => round($s->avg('score'), 1),
                'count'       => $s->count(),
                'status'      => $this->getStatus(round($s->avg('score'), 1)),
            ])
            ->values()
            ->toArray();
    }

    // Analitik performa semua siswa di kelas per topik
    public function getClassroomTopicStats(array $studentIds): array
    {
        $sessions = QuizSession::whereIn('student_id', $studentIds)
                                ->where('status', 'completed')
                                ->with('quiz.chapter')
                                ->get();

        return $sessions->groupBy('quiz.chapter.name')
            ->map(fn($s) => [
                'chapter'   => $s->first()->quiz->chapter->name ?? 'Umum',
                'avg_score' => round($s->avg('score'), 1),
                'count'     => $s->count(),
                'status'    => $this->getStatus(round($s->avg('score'), 1)),
            ])
            ->values()
            ->toArray();
    }

    // Leaderboard kelas
    public function getLeaderboard(array $studentIds, int $limit = 10): array
    {
        return User::whereIn('id', $studentIds)
                    ->with('studentPoint')
                    ->get()
                    ->sortByDesc('studentPoint.total_points')
                    ->take($limit)
                    ->map(fn($s) => [
                        'student'      => $s->only('id', 'name', 'avatar'),
                        'total_points' => $s->studentPoint->total_points ?? 0,
                        'level'        => $s->studentPoint->level ?? 1,
                    ])
                    ->values()
                    ->toArray();
    }

    // Label status penguasaan
    private function getStatus(float $avgScore): string
    {
        return match(true) {
            $avgScore >= 80 => 'Kuat',
            $avgScore >= 60 => 'Cukup',
            default         => 'Perlu Perhatian',
        };
    }
}