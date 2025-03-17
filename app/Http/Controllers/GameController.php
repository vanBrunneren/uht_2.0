<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Game;
use App\Team;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

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

        return Inertia::render('Games', [
            'games' => $games
        ]);

    }

    public function getGamesByCategoryId($categoryId) {

        $category = Category::with(['teams' => function($query) {
            $query->orderBy('name', 'asc');
        }])->findOrFail($categoryId);

        $games = Game::with(['team1:id,name', 'team2:id,name'])
            ->whereHas('team1', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->get();

        return Inertia::render('Games', [
            'games' => $games,
            'category' => $category
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

    public function finishGame(Request $request) {

        $validated = $request->validate([
            'game_id' => 'required|integer|exists:games,id'
        ]);

        $game = Game::findOrFail($validated['game_id']);

        if($game->finished) {
            $game->finished = false;
        } else {
            $game->finished = true;
        }

        $game->save();

        return response()->json([
            'success' => true,
            'game' => $game->only(['id', 'finished'])
        ]);

    }

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'team_1_id' => 'required|exists:teams,id',
            'team_2_id' => 'required|exists:teams,id|different:team_1_id',
            'team_1_goals' => 'required|integer|min:0',
            'team_2_goals' => 'required|integer|min:0',
            'length' => 'required|date_format:H:i:s',
            'start_datetime' => 'required|date',
            'finished' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create the game
        $game = Game::create($request->all());

        return response()->json([
            'message' => 'Game created successfully',
            'game' => $game
        ], 201);
    }

    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();

        return response()->json([
            'message' => 'Game deleted successfully'
        ]);
    }

}
