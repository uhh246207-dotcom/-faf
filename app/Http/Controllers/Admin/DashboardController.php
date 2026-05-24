<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RedemptionCode;
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
        $codeCount = RedemptionCode::count();
        $activeCodeCount = RedemptionCode::active()->count();

        return view('admin.dashboard', compact('templateCount', 'renderCount', 'userCount', 'codeCount', 'activeCodeCount'));
    }
}
