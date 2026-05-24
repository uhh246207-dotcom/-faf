<?php

namespace App\Services;

use App\Models\Render;

interface PsdRenderService
{
    /**
     * Render the PSD with the given render data.
     *
     * @param Render $render
     * @return string The output file path (relative to storage disk)
     */
    public function render(Render $render): string;
}
