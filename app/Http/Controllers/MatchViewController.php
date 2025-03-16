<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;

class MatchViewController extends Controller
{

    public function index($id)
    {

        $game = Game::with(['team1:id,name', 'team2:id,name'])->find($id);

        return Inertia::render('MatchView', [
            'game' => $game
        ]);

    }

}
