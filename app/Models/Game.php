<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'team_1_id',
        'team_2_id',
        'team_1_goals',
        'team_2_goals',
        'length',
        'start_datetime',
        'finished'
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'length' => 'datetime',
        'finished' => 'boolean'
    ];

    /**
     * Get the team 1 for the game.
     */
    public function team1(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_1_id');
    }

    /**
     * Get the team 2 for the game.
     */
    public function team2(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_2_id');
    }
}
