<?php

namespace App\Services;

use App\Models\Render;
use Illuminate\Support\Facades\Storage;

class MockRenderService implements PsdRenderService
{
    public function render(Render $render): string
    {
        $template = $render->template;
        $layers = $template->layers()->editable()->orderBy('z_index')->get();
        $inputData = $render->input_data;

        $previewPath = Storage::disk('public')->path($template->preview_path);

        if (!file_exists($previewPath)) {
            $canvas = imagecreatetruecolor(800, 600);
            $white = imagecolorallocate($canvas, 255, 255, 255);
            imagefill($canvas, 0, 0, $white);
        } else {
            $imageInfo = getimagesize($previewPath);
            $mime = $imageInfo['mime'] ?? '';

            $canvas = match ($mime) {
                'image/png' => imagecreatefrompng($previewPath),
                'image/jpeg', 'image/jpg' => imagecreatefromjpeg($previewPath),
                'image/webp' => imagecreatefromwebp($previewPath),
                default => imagecreatetruecolor(800, 600),
            };
        }

        $width = imagesx($canvas);
        $height = imagesy($canvas);

        foreach ($layers as $layer) {
            $fieldKey = $layer->field_key;

            if (!isset($inputData[$fieldKey])) {
                continue;
            }

            if ($layer->type === 'text') {
                $this->overlayText($canvas, $layer, $inputData[$fieldKey]);
            } elseif ($layer->type === 'image') {
                $this->overlayImage($canvas, $layer, $inputData[$fieldKey]);
            }
        }

        $outputPath = "renders/outputs/{$render->id}.png";
        $outputFullPath = Storage::disk('public')->path($outputPath);

        $outputDir = dirname($outputFullPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        imagepng($canvas, $outputFullPath);
        imagedestroy($canvas);

        return $outputPath;
    }

    private function overlayText($canvas, $layer, string $text): void
    {
        $x = $layer->preview_x ?? 10;
        $y = $layer->preview_y ?? 30;
        $fontSize = $layer->font_size ?? 16;
        $fontColor = $layer->font_color ?? '#000000';

        $rgb = $this->hexToRgb($fontColor);
        $color = imagecolorallocate($canvas, $rgb[0], $rgb[1], $rgb[2]);

        $gdFontSize = max(1, min(5, intval($fontSize / 8)));

        imagestring($canvas, $gdFontSize, $x, $y, $text, $color);
    }

    private function overlayImage($canvas, $layer, string $imagePath): void
    {
        $fullPath = Storage::disk('public')->path($imagePath);

        if (!file_exists($fullPath)) {
            return;
        }

        $imageInfo = getimagesize($fullPath);
        $mime = $imageInfo['mime'] ?? '';

        $overlay = match ($mime) {
            'image/png' => imagecreatefrompng($fullPath),
            'image/jpeg', 'image/jpg' => imagecreatefromjpeg($fullPath),
            'image/webp' => imagecreatefromwebp($fullPath),
            default => null,
        };

        if (!$overlay) {
            return;
        }

        $x = $layer->preview_x ?? 0;
        $y = $layer->preview_y ?? 0;
        $targetWidth = $layer->preview_width ?? imagesx($overlay);
        $targetHeight = $layer->preview_height ?? imagesy($overlay);

        imagecopyresampled(
            $canvas,
            $overlay,
            $x,
            $y,
            0,
            0,
            $targetWidth,
            $targetHeight,
            imagesx($overlay),
            imagesy($overlay)
        );

        imagedestroy($overlay);
    }

    private function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');

        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
