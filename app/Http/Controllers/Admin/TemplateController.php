<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTemplateRequest;
use App\Models\Template;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::latest()->paginate(20);

        return view('admin.templates.index', compact('templates'));
    }

    public function create()
    {
        return view('admin.templates.create');
    }

    public function store(StoreTemplateRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('psd_file')) {
            $data['psd_path'] = $request->file('psd_file')->store('psds', 'public');
        }

        if ($request->hasFile('preview_file')) {
            $data['preview_path'] = $request->file('preview_file')->store('previews', 'public');
        }

        unset($data['psd_file'], $data['preview_file']);

        Template::create($data);

        return redirect('/admin/templates')->with('success', 'Template created successfully.');
    }

    public function edit(Template $template)
    {
        return view('admin.templates.edit', compact('template'));
    }

    public function update(StoreTemplateRequest $request, Template $template)
    {
        $data = $request->validated();

        if ($request->hasFile('psd_file')) {
            $data['psd_path'] = $request->file('psd_file')->store('psds', 'public');
        }

        if ($request->hasFile('preview_file')) {
            $data['preview_path'] = $request->file('preview_file')->store('previews', 'public');
        }

        unset($data['psd_file'], $data['preview_file']);

        $template->update($data);

        return redirect('/admin/templates')->with('success', 'Template updated successfully.');
    }

    public function destroy(Template $template)
    {
        $template->delete();

        return redirect('/admin/templates')->with('success', 'Template deleted successfully.');
    }
}
