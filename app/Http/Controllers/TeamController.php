<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {

        $teams = Team::all();

        return Inertia::render('teams', [
            'teams' => $teams
        ]);

    }
}
