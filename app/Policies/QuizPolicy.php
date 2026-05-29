<?php

namespace App\Policies;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class QuizPolicy
{
    use HandlesAuthorization;

    /**
     * Tentukan apakah user boleh melihat (detail) kuis ini.
     */
    public function view(User $user, Quiz $quiz): bool
    {
        return $user->id === $quiz->teacher_id;
    }

    /**
     * Tentukan apakah user boleh mengupdate/mengedit kuis ini.
     */
    public function update(User $user, Quiz $quiz): bool
    {
        return $user->id === $quiz->teacher_id;
    }

    /**
     * Tentukan apakah user boleh menghapus kuis ini.
     */
    public function delete(User $user, Quiz $quiz): bool
    {
        return $user->id === $quiz->teacher_id;
    }
}