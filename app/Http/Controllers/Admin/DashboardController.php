<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Render;
use App\Models\Template;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $templateCount = Template::count();
        $renderCount = Render::count();
        $userCount = User::count();

        return view('admin.dashboard', compact('templateCount', 'renderCount', 'userCount'));
    }
}
