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

        try {
            $tokenService->deduct($user, $template->token_price, $render);
        } catch (\RuntimeException $e) {
            $render->update(['status' => Render::STATUS_FAILED, 'error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Not enough tokens',
            ]);
        }

        RenderPsdJob::dispatch($render);

        return response()->json([
            'success' => true,
            'render_id' => $render->id,
        ]);
    }

    public function status(Render $render)
    {
        if ($render->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return response()->json([
            'status' => $render->status,
            'download_url' => $render->status === Render::STATUS_COMPLETED
                ? route('renders.download', $render)
                : null,
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
