<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('template_layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->string('layer_name');
            $table->string('field_key');
            $table->string('type');
            $table->string('label');
            $table->boolean('editable')->default(true);
            $table->boolean('required')->default(false);
            $table->integer('max_length')->nullable();
            $table->text('default_value')->nullable();
            $table->string('accepted_file_types')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('preview_x')->nullable();
            $table->integer('preview_y')->nullable();
            $table->integer('preview_width')->nullable();
            $table->integer('preview_height')->nullable();
            $table->integer('font_size')->nullable();
            $table->string('font_color')->nullable();
            $table->string('text_align')->nullable();
            $table->integer('z_index')->nullable();
            $table->boolean('allow_ai_edit')->default(true);
            $table->boolean('allow_color_edit')->default(false);
            $table->boolean('allow_position_edit')->default(false);
            $table->boolean('allow_size_edit')->default(false);
            $table->boolean('allow_effect_edit')->default(false);
            $table->string('stroke_color')->nullable();
            $table->integer('stroke_width')->nullable();
            $table->string('glow_color')->nullable();
            $table->integer('brightness')->nullable();
            $table->integer('contrast')->nullable();
            $table->integer('saturation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_layers');
    }
};
