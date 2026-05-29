<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'quiz_id', 'content', 'type',
        'explanation', 'order', 'points', 'time_limit'
    ];

    public function quiz() { return $this->belongsTo(Quiz::class); }
    public function options() { return $this->hasMany(Option::class); }
    public function correctOption() { return $this->hasOne(Option::class)->where('is_correct', true); }
    public function studentAnswers() { return $this->hasMany(StudentAnswer::class); }
}