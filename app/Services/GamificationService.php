<?php

namespace App\Services;

use App\Models\QuizSession;
use App\Models\StudentPoint;
use App\Models\PointTransaction;
use App\Models\Badge;
use App\Models\StudentBadge;
use Carbon\Carbon;

class GamificationService
{
    public function process(QuizSession $session): void
    {
        $student = $session->student;
        $points  = $session->total_points_earned;

        // 1. Tambah poin & XP
        $this->addPoints($student->id, $points, 'Kuis: ' . $session->quiz->title, $session);

        // 2. Cek naik level
        $this->checkLevelUp($student->id);

        // 3. Update streak
        $this->updateStreak($student->id);

        // 4. Cek & berikan badge
        $this->checkAndAwardBadges($student->id, $session);
    }

    // TAMBAH POIN
    private function addPoints(int $studentId, int $amount, string $reason, QuizSession $session): void
    {
        // Catat transaksi poin
        PointTransaction::create([
            'student_id'     => $studentId,
            'amount'         => $amount,
            'reason'         => $reason,
            'reference_type' => QuizSession::class,
            'reference_id'   => $session->id,
        ]);

        // Update total poin & XP
        $point = StudentPoint::firstOrCreate(
            ['student_id' => $studentId],
            ['total_points' => 0, 'level' => 1, 'experience' => 0, 'streak_days' => 0]
        );

        $point->increment('total_points', $amount);
        $point->increment('experience', $amount);
    }

    // CEK NAIK LEVEL
    private function checkLevelUp(int $studentId): void
    {
        $point = StudentPoint::where('student_id', $studentId)->first();

        if (!$point) return;

        // Formula: tiap level butuh level * 500 XP
        $xpNeeded = $point->level * 500;

        while ($point->experience >= $xpNeeded) {
            $point->experience -= $xpNeeded;
            $point->level++;
            $xpNeeded = $point->level * 500;
        }

        $point->save();
    }

    // UPDATE STREAK
    private function updateStreak(int $studentId): void
    {
        $point = StudentPoint::where('student_id', $studentId)->first();

        if (!$point) return;

        $today     = Carbon::today()->toDateString();
        $lastDate  = $point->last_activity_date
                        ? Carbon::parse($point->last_activity_date)
                        : null;

        if (!$lastDate) {
            // Pertama kali belajar
            $point->streak_days        = 1;
            $point->last_activity_date = $today;
        } elseif ($lastDate->isYesterday()) {
            // Belajar hari berturut-turut
            $point->streak_days++;
            $point->last_activity_date = $today;
        } elseif (!$lastDate->isToday()) {
            // Streak putus
            $point->streak_days        = 1;
            $point->last_activity_date = $today;
        }
        // Jika lastDate adalah hari ini, tidak ubah streak (sudah dihitung)

        $point->save();
    }

    // CEK & BERIKAN BADGE
    private function checkAndAwardBadges(int $studentId, QuizSession $session): void
    {
        $badges  = Badge::all();
        $point   = StudentPoint::where('student_id', $studentId)->first();
        $student = $session->student;

        foreach ($badges as $badge) {
            // Cek apakah siswa sudah punya badge ini
            $alreadyHas = StudentBadge::where('student_id', $studentId)
                                       ->where('badge_id', $badge->id)
                                       ->exists();
            if ($alreadyHas) continue;

            $earned = match($badge->condition_type) {

                // Jumlah kuis selesai
                'quiz_count' => $this->checkQuizCount($studentId, $badge->condition_value),

                // Skor sempurna
                'perfect_score' => $session->score == 100,

                // Streak harian
                'streak' => $point && $point->streak_days >= $badge->condition_value,

                // Variasi mata pelajaran
                'subject_variety' => $this->checkSubjectVariety($studentId, $badge->condition_value),

                // Kecepatan & akurasi
                'speed_accuracy' => $this->checkSpeedAccuracy($session, $badge->condition_value),

                // Level
                'level' => $point && $point->level >= $badge->condition_value,

                default => false,
            };

            if ($earned) {
                StudentBadge::create([
                    'student_id' => $studentId,
                    'badge_id'   => $badge->id,
                    'earned_at'  => now(),
                ]);
            }
        }
    }

    // HELPER: Cek jumlah kuis selesai
    private function checkQuizCount(int $studentId, int $target): bool
    {
        return QuizSession::where('student_id', $studentId)
                          ->where('status', 'completed')
                          ->count() >= $target;
    }

    // HELPER: Cek variasi mata pelajaran
    private function checkSubjectVariety(int $studentId, int $target): bool
    {
        return QuizSession::where('student_id', $studentId)
                          ->where('status', 'completed')
                          ->with('quiz.subject')
                          ->get()
                          ->pluck('quiz.subject_id')
                          ->unique()
                          ->count() >= $target;
    }

    // HELPER: Cek kecepatan & akurasi
    private function checkSpeedAccuracy(QuizSession $session, int $minScore): bool
    {
        if ($session->score < $minScore) return false;

        $durationSeconds = $session->quiz->duration * 60;
        $takenSeconds    = $session->duration_taken ?? $durationSeconds;

        return $takenSeconds <= ($durationSeconds * 0.5);
    }
}