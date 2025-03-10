<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/teams', function() {
    return Inertia::render('teams', [
        'teams' => [
            ['id' => 1, 'name' => 'Team 1'],
            ['id' => 2, 'name' => 'Team 2'],
            ['id' => 3, 'name' => 'Team 3'],
        ]
    ]);
})->name('teams');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
