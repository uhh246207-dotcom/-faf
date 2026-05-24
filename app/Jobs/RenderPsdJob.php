<?php

namespace App\Jobs;

use App\Models\Render;
use App\Services\AdobeRenderService;
use App\Services\MockRenderService;
use App\Services\PsdRenderService;
use App\Services\TierService;
use App\Services\TokenService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RenderPsdJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Render $render;

    public function __construct(Render $render)
    {
        $this->render = $render;
    }

    public function handle(): void
    {
        $this->render->update(['status' => Render::STATUS_PROCESSING]);

        try {
            $service = $this->getRenderService();
            $outputPath = $service->render($this->render);

            $this->render->update([
                'status' => Render::STATUS_COMPLETED,
                'output_path' => $outputPath,
            ]);

            // Update user tier after successful render
            $tierService = new TierService();
            $tierService->updateUserTier($this->render->user);
        } catch (\Exception $e) {
            $this->render->update([
                'status' => Render::STATUS_FAILED,
                'error_message' => $e->getMessage(),
            ]);

            $tokenService = new TokenService();
            $tokenService->refund(
                $this->render->user,
                $this->render->token_cost,
                $this->render
            );
        }
    }

    private function getRenderService(): PsdRenderService
    {
        if (config('services.adobe.mock')) {
            return new MockRenderService();
        }

        return new AdobeRenderService();
    }
}
