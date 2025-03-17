<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Game;
use Inertia\Inertia;

class MatchViewController extends Controller
{

    public function index($id)
    {

        $game = Game::with(['team1', 'team2'])->find($id);

        $categoryId = $game->team1->category_id;

        $games = Game::with(['team1:id,name', 'team2:id,name'])
            ->whereHas('team1', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->orderBy('id', 'asc')
            ->get();

        $nextGame = $games->where('id', '>', $id)->sortBy('id')->first();

        if ($nextGame) {
            $nextId = $nextGame->id;
        } else {
            $nextId = ++$id;
        }

        return Inertia::render('MatchView', [
            'game' => $game,
            'nextId' => $nextId
        ]);

    }

}
