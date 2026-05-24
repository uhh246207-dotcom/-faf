<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTemplateLayerRequest;
use App\Models\Template;
use App\Models\TemplateLayer;

class TemplateLayerController extends Controller
{
    public function index(Template $template)
    {
        $layers = $template->layers()->orderBy('sort_order')->get();

        return view('admin.templates.layers.index', compact('template', 'layers'));
    }

    public function create(Template $template)
    {
        return view('admin.templates.layers.create', compact('template'));
    }

    public function store(StoreTemplateLayerRequest $request, Template $template)
    {
        $template->layers()->create($request->validated());

        return redirect("/admin/templates/{$template->id}/layers")
            ->with('success', 'Layer created successfully.');
    }

    public function edit(Template $template, TemplateLayer $layer)
    {
        return view('admin.templates.layers.edit', compact('template', 'layer'));
    }

    public function update(StoreTemplateLayerRequest $request, Template $template, TemplateLayer $layer)
    {
        $layer->update($request->validated());

        return redirect("/admin/templates/{$template->id}/layers")
            ->with('success', 'Layer updated successfully.');
    }

    public function destroy(Template $template, TemplateLayer $layer)
    {
        $layer->delete();

        return redirect("/admin/templates/{$template->id}/layers")
            ->with('success', 'Layer deleted successfully.');
    }
}
