<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Team;
use Inertia\Inertia;

class CategoriesController extends Controller {

    public function index() {

        $teams = Team::with(['category'])
            ->whereHas('category', function($query) {
                $query->where('active', true);
            })
            ->get();

        return Inertia::render('MainPage', [
            'teams' => $teams
        ]);

    }

    public function categories() {

        $categories = Category::all();

        return Inertia::render('Categories', [
            'categories' => $categories
        ]);

    }

}
