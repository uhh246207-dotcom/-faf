<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitRenderRequest;
use App\Jobs\RenderPsdJob;
use App\Models\Render;
use App\Models\Template;
use App\Services\TokenService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RenderController extends Controller
{
    public function store(SubmitRenderRequest $request, Template $template)
    {
        $user = Auth::user();

        if ($user->token_balance < $template->token_price) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough tokens',
            ]);
        }

        $inputData = [];
        $layers = $template->layers()->editable()->get();

        foreach ($layers as $layer) {
            $fieldKey = $layer->field_key;

            if ($layer->type === 'image' && $request->hasFile($fieldKey)) {
                $path = $request->file($fieldKey)->store('renders/inputs', 'public');
                $inputData[$fieldKey] = $path;
            } elseif ($layer->type === 'text' && $request->has($fieldKey)) {
                $inputData[$fieldKey] = $request->input($fieldKey);
            }
        }

        $render = Render::create([
            'user_id' => $user->id,
            'template_id' => $template->id,
            'status' => Render::STATUS_PENDING,
            'input_data' => $inputData,
            'token_cost' => $template->token_price,
        ]);

        $tokenService = new TokenService();
        $tokenService->deduct($user, $template->token_price, $render);

        RenderPsdJob::dispatch($render);

        return response()->json([
            'success' => true,
            'render_id' => $render->id,
        ]);
    }

    public function status(Render $render)
    {
        return response()->json([
            'status' => $render->status,
            'output_url' => $render->output_path ? Storage::url($render->output_path) : null,
            'error' => $render->error_message,
        ]);
    }

    public function download(Render $render)
    {
        if ($render->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        if ($render->status !== Render::STATUS_COMPLETED) {
            abort(404, 'Render not completed');
        }

        return Storage::disk('public')->download($render->output_path);
    }
}
