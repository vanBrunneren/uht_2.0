<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Team;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{

    public function index()
    {

        $games = Game::with(['team1:id,name', 'team2:id,name'])->get()
            ->map(function ($game) {
                $game->team_1 = $game->team1->name;
                $game->team_2 = $game->team2->name;
                return $game;
            });

        return Inertia::render('games', [
            'games' => $games
        ]);

    }

    public function updateGoal(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'game_id' => 'required|integer|exists:games,id',
            'team_id' => 'required|integer|in:1,2',
            'goals' => 'required|integer|min:0',
        ]);

        // Find the game
        $game = Game::findOrFail($validated['game_id']);

        // Update the appropriate field based on team_id
        if ($validated['team_id'] == 1) {
            $game->team_1_goals = $validated['goals'];
        } else {
            $game->team_2_goals = $validated['goals'];
        }

        // Save the changes
        $game->save();

        // Return a response
        return response()->json([
            'success' => true,
            'game' => $game->only(['id', 'team_1_goals', 'team_2_goals'])
        ]);
    }

}
