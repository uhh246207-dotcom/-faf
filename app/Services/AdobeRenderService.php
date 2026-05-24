<?php

namespace App\Services;

use App\Models\Render;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class AdobeRenderService implements PsdRenderService
{
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.adobe.client_id', '');
        $this->clientSecret = config('services.adobe.client_secret', '');
    }

    public function render(Render $render): string
    {
        $accessToken = $this->getAccessToken();
        $template = $render->template;
        $layers = $template->layers()->editable()->get();
        $inputData = $render->input_data;

        $layerModifications = [];

        foreach ($layers as $layer) {
            $fieldKey = $layer->field_key;

            if (!isset($inputData[$fieldKey])) {
                continue;
            }

            if ($layer->type === 'text') {
                $layerModifications[] = [
                    'name' => $layer->layer_name,
                    'edit' => [
                        'type' => 'text',
                        'text' => [
                            'content' => $inputData[$fieldKey],
                        ],
                    ],
                ];
            } elseif ($layer->type === 'image') {
                $imageUrl = Storage::disk('public')->url($inputData[$fieldKey]);
                $layerModifications[] = [
                    'name' => $layer->layer_name,
                    'edit' => [
                        'type' => 'smartObject',
                        'smartObject' => [
                            'path' => $imageUrl,
                        ],
                    ],
                ];
            }
        }

        $psdUrl = Storage::disk('public')->url($template->psd_path);
        $outputPath = "renders/outputs/{$render->id}.png";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$accessToken}",
            'x-api-key' => $this->clientId,
            'Content-Type' => 'application/json',
        ])->post('https://image.adobe.io/pie/psdService/documentOperations', [
            'inputs' => [
                [
                    'href' => $psdUrl,
                    'storage' => 'external',
                ],
            ],
            'options' => [
                'layers' => $layerModifications,
            ],
            'outputs' => [
                [
                    'href' => Storage::disk('public')->path($outputPath),
                    'storage' => 'external',
                    'type' => 'image/png',
                ],
            ],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('Adobe API request failed: ' . $response->body());
        }

        return $outputPath;
    }

    private function getAccessToken(): string
    {
        $response = Http::asForm()->post('https://ims-na1.adobelogin.com/ims/token/v3', [
            'grant_type' => 'client_credentials',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'scope' => 'openid,AdobeID,read_organizations',
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('Failed to get Adobe access token: ' . $response->body());
        }

        return $response->json('access_token');
    }
}
