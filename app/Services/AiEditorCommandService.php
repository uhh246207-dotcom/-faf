<?php

namespace App\Services;

use App\Models\Template;
use Illuminate\Support\Facades\Http;

class AiEditorCommandService
{
    private const ALLOWED_ACTION_TYPES = [
        'update_text',
        'update_style',
        'update_image_adjustment',
        'update_transform',
    ];

    public function parseCommand(string $command, Template $template): array
    {
        $layers = $template->layers()
            ->where('allow_ai_edit', true)
            ->where('layer_name', 'NOT LIKE', 'LOCK_%')
            ->get();

        if ($layers->isEmpty()) {
            return [];
        }

        $apiKey = config('app.openai_api_key', env('OPENAI_API_KEY'));
        $model = config('app.openai_model', env('OPENAI_MODEL', 'gpt-4'));

        if (config('services.adobe.mock') && empty($apiKey)) {
            return $this->getMockActions($command, $layers);
        }

        $layerDescriptions = $layers->map(function ($layer) {
            $permissions = [];
            if ($layer->allow_color_edit) {
                $permissions[] = 'color';
            }
            if ($layer->allow_position_edit) {
                $permissions[] = 'position';
            }
            if ($layer->allow_size_edit) {
                $permissions[] = 'size';
            }
            if ($layer->allow_effect_edit) {
                $permissions[] = 'effects';
            }

            return [
                'field_key' => $layer->field_key,
                'layer_name' => $layer->layer_name,
                'type' => $layer->type,
                'label' => $layer->label,
                'permissions' => $permissions,
            ];
        })->toArray();

        $systemPrompt = "You are an AI editor assistant. Given a user command and available template layers, return a JSON array of actions to perform. Each action must have: field_key, action_type (one of: update_text, update_style, update_image_adjustment, update_transform), and params (key-value pairs for the changes). Only modify layers that exist and respect their permissions. Available layers: " . json_encode($layerDescriptions);

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $command],
            ],
            'temperature' => 0.3,
            'response_format' => ['type' => 'json_object'],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('AI service request failed');
        }

        $content = $response->json('choices.0.message.content');
        $parsed = json_decode($content, true);

        $actions = $parsed['actions'] ?? $parsed ?? [];

        if (!is_array($actions)) {
            return [];
        }

        return $this->validateActions($actions, $layers);
    }

    private function validateActions(array $actions, $layers): array
    {
        $validFieldKeys = $layers->pluck('field_key')->toArray();
        $layerMap = $layers->keyBy('field_key');
        $validated = [];

        foreach ($actions as $action) {
            if (!isset($action['field_key'], $action['action_type'])) {
                continue;
            }

            if (!in_array($action['field_key'], $validFieldKeys)) {
                continue;
            }

            if (!in_array($action['action_type'], self::ALLOWED_ACTION_TYPES)) {
                continue;
            }

            $layer = $layerMap[$action['field_key']];

            if ($action['action_type'] === 'update_style') {
                if (!$layer->allow_color_edit && !$layer->allow_size_edit) {
                    continue;
                }
            }

            if ($action['action_type'] === 'update_transform') {
                if (!$layer->allow_position_edit && !$layer->allow_size_edit) {
                    continue;
                }
            }

            if ($action['action_type'] === 'update_image_adjustment') {
                if (!$layer->allow_effect_edit) {
                    continue;
                }
            }

            $validated[] = [
                'field_key' => $action['field_key'],
                'action_type' => $action['action_type'],
                'params' => $action['params'] ?? [],
            ];
        }

        return $validated;
    }

    private function getMockActions(string $command, $layers): array
    {
        $actions = [];
        $commandLower = strtolower($command);

        foreach ($layers as $layer) {
            if ($layer->type === 'text' && (str_contains($commandLower, 'text') || str_contains($commandLower, $layer->field_key))) {
                $actions[] = [
                    'field_key' => $layer->field_key,
                    'action_type' => 'update_text',
                    'params' => ['content' => 'AI generated text'],
                ];
                break;
            }

            if (str_contains($commandLower, 'color') && $layer->allow_color_edit) {
                $actions[] = [
                    'field_key' => $layer->field_key,
                    'action_type' => 'update_style',
                    'params' => ['font_color' => '#FF0000'],
                ];
                break;
            }

            if (str_contains($commandLower, 'size') && $layer->allow_size_edit) {
                $actions[] = [
                    'field_key' => $layer->field_key,
                    'action_type' => 'update_style',
                    'params' => ['font_size' => 24],
                ];
                break;
            }
        }

        return $actions;
    }
}
