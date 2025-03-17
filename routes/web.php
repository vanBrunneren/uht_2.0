<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\MatchViewController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::get('/teams', [TeamController::class, 'index'])->name('teams');
Route::get('/games', [GameController::class, 'index'])->name('Games');
Route::get('/games/{categoryId}', [GameController::class, 'getGamesByCategoryId'])->name('Games');
Route::post('/games/store', [GameController::class, 'store'])->name('Games');
Route::post('/games/destroy/{id}', [GameController::class, 'destroy'])->name('Games');
Route::get('/matchview/{id}', [MatchViewController::class, 'index'])->name('MatchView');
Route::post('/games/goal', [GameController::class, 'updateGoal']);
Route::post('/games/finish', [GameController::class, 'finishGame']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
