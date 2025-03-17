<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'start_datetime'
    ];

    protected $casts = [
        'start_datetime' => 'datetime'
    ];

    /**
     * Get the teams for the category.
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
}
