<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPoint extends Model
{
    protected $fillable = [
        'student_id', 'total_points', 'level',
        'experience', 'streak_days', 'last_activity_date'
    ];

    protected $casts = ['last_activity_date' => 'date'];

    public function student() { return $this->belongsTo(User::class, 'student_id'); }

    public function xpForNextLevel(): int
    {
        return $this->level * 500;
    }

    public function levelProgress(): float
    {
        return min(100, ($this->experience / $this->xpForNextLevel()) * 100);
    }
}