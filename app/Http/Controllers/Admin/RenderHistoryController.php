<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Render;

class RenderHistoryController extends Controller
{
    public function index()
    {
        $renders = Render::with(['user', 'template'])
            ->latest()
            ->paginate(20);

        return view('admin.renders.index', compact('renders'));
    }
}
