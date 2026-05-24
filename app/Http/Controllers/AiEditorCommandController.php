<?php

namespace App\Http\Controllers;

use App\Http\Requests\AiEditorCommandRequest;
use App\Models\Template;
use App\Services\AiEditorCommandService;

class AiEditorCommandController extends Controller
{
    public function process(AiEditorCommandRequest $request)
    {
        $template = Template::findOrFail($request->input('template_id'));
        $command = $request->input('command');

        try {
            $service = new AiEditorCommandService();
            $actions = $service->parseCommand($command, $template);

            return response()->json([
                'success' => true,
                'actions' => $actions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
