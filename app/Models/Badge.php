<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = [
        'name', 'description', 'icon',
        'condition_type', 'condition_value'
    ];

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_badges', 'badge_id', 'student_id')
                    ->withPivot('earned_at');
    }
}