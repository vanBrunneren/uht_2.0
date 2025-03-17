<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\MatchViewController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

//Route::get('/teams', [TeamController::class, 'index'])->name('teams');
//Route::get('/games', [GameController::class, 'index'])->name('Games');

Route::get('/', [CategoriesController::class, 'index']);

Route::get('/matchview/{id}', [MatchViewController::class, 'index'])->name('MatchView');

Route::get('/admin', [CategoriesController::class, 'categories'])->name('Categories');
Route::get('/admin/games/{categoryId}', [GameController::class, 'getGamesByCategoryId'])->name('GamesByCategory');

Route::get('/games/{id}', [GameController::class, 'getGamesByTeamId'])->name('GetGamesByTeamId');
Route::post('/games/goal', [GameController::class, 'updateGoal']);
Route::post('/games/finish', [GameController::class, 'finishGame']);
Route::post('/games/store', [GameController::class, 'store'])->name('StoreGames');
Route::post('/games/destroy/{id}', [GameController::class, 'destroy'])->name('DestroyGames');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
