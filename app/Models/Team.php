<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'category_id',
        'groupid'
    ];

    /**
     * Get the category that owns the team.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The contacts that belong to the team.
     */
    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, 'team_contact')
            ->withTimestamps();
    }

    /**
     * Get the games where this team is team 1.
     */
    public function homeGames(): HasMany
    {
        return $this->hasMany(Game::class, 'team_1_id');
    }

    /**
     * Get the games where this team is team 2.
     */
    public function awayGames(): HasMany
    {
        return $this->hasMany(Game::class, 'team_2_id');
    }

    /**
     * Get all games for this team (both home and away).
     */
    public function allGames()
    {
        return Game::where('team_1_id', $this->id)
            ->orWhere('team_2_id', $this->id);
    }
}
