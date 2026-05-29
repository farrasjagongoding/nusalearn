<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'school', 'avatar', 'grade', 'level_school'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Cek role
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isTeacher(): bool { return $this->role === 'teacher'; }
    public function isStudent(): bool { return $this->role === 'student'; }

    // Relationships
    public function quizzes() { return $this->hasMany(Quiz::class, 'teacher_id'); }
    public function classrooms() { return $this->hasMany(Classroom::class, 'teacher_id'); }
    public function quizSessions() { return $this->hasMany(QuizSession::class, 'student_id'); }
    public function studentPoint() { return $this->hasOne(StudentPoint::class, 'student_id'); }
    public function pointTransactions() { return $this->hasMany(PointTransaction::class, 'student_id'); }
    public function studentBadges() { return $this->hasMany(StudentBadge::class, 'student_id'); }
    public function badges() { return $this->belongsToMany(Badge::class, 'student_badges', 'student_id', 'badge_id')->withPivot('earned_at'); }
    public function joinedClassrooms() { return $this->belongsToMany(Classroom::class, 'classroom_students', 'student_id', 'classroom_id')->withPivot('joined_at'); }
}