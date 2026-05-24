<?php

namespace App\Http\Controllers;

use App\Models\Template;

class TemplateEditorController extends Controller
{
    public function index()
    {
        $templates = Template::active()->latest()->get();

        return view('templates.index', compact('templates'));
    }

    public function show(string $slug)
    {
        $template = Template::where('slug', $slug)->firstOrFail();
        $layers = $template->layers()
            ->editable()
            ->orderBy('sort_order')
            ->get();

        return view('templates.editor', compact('template', 'layers'));
    }
}
