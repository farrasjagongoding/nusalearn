<?php

namespace App\Services;

use App\Models\QuizSession;
use App\Models\StudentAnswer;
use App\Models\Option;

class QuizScoringService
{
    public function calculate(QuizSession $session): array
    {
        $session->load('quiz.questions.options', 'answers');

        $questions      = $session->quiz->questions;
        $totalQuestions = $questions->count();
        $correctCount   = 0;
        $totalPoints    = 0;

        foreach ($questions as $question) {
            $answer = $session->answers->where('question_id', $question->id)->first();

            if (!$answer || !$answer->selected_option_id) continue;

            $correctOption = $question->options->where('is_correct', true)->first();

            $isCorrect = $correctOption && $answer->selected_option_id === $correctOption->id;

            // Update jawaban siswa
            $answer->update(['is_correct' => $isCorrect]);

            if ($isCorrect) {
                $correctCount++;
                $totalPoints += $question->points;
            }
        }

        // Hitung skor 0-100
        $score = $totalQuestions > 0
            ? round(($correctCount / $totalQuestions) * 100, 2)
            : 0;

        // Hitung poin gamifikasi berdasarkan skor & kecepatan
        $pointsEarned = $this->calculateGamificationPoints(
            $score,
            $session->started_at,
            $session->quiz->duration
        );

        return [
            'score'         => $score,
            'correct_count' => $correctCount,
            'total'         => $totalQuestions,
            'points_earned' => $pointsEarned,
        ];
    }

    private function calculateGamificationPoints(
        float $score,
        $startedAt,
        int $duration
    ): int {
        $basePoints = (int) round($score);

        // Bonus kecepatan: jika selesai sebelum 50% waktu habis
        $durationSeconds  = $duration * 60;
        $takenSeconds     = now()->diffInSeconds($startedAt);
        $speedBonus       = 0;

        if ($takenSeconds <= ($durationSeconds * 0.5)) {
            $speedBonus = 50; // bonus 50 poin
        } elseif ($takenSeconds <= ($durationSeconds * 0.75)) {
            $speedBonus = 25; // bonus 25 poin
        }

        return $basePoints + $speedBonus;
    }
}