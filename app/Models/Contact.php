<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'prename',
        'street',
        'plz',
        'city',
        'phone',
        'email',
        'knownfrom'
    ];

    /**
     * The teams that belong to the contact.
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_contact')
            ->withTimestamps();
    }
}
