<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = ['subject_id', 'name', 'grade', 'order'];

    public function subject() { return $this->belongsTo(Subject::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }
}