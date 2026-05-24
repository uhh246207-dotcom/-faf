/**
 * PSD Editor - Alpine.js Component
 * Handles real-time preview, file uploads, render submission, and AI commands.
 */
function editorComponent(layers, tokenPrice, tokenBalance, templateId) {
    return {
        layers: layers,
        fields: {},
        imageFiles: {},
        imagePreviews: {},
        rendering: false,
        renderComplete: false,
        renderFailed: false,
        renderError: '',
        renderId: null,
        outputUrl: null,
        aiCommand: '',
        aiLoading: false,
        aiActions: [],
        tokenBalance: tokenBalance,
        tokenPrice: tokenPrice,
        templateId: templateId,
        pollInterval: null,

        init() {
            // Initialize fields with default values
            this.layers.forEach(layer => {
                if (layer.type === 'text') {
                    this.fields[layer.field_key] = layer.default_value || '';
                }
            });
        },

        get textLayers() {
            return this.layers.filter(l => l.type === 'text' && l.editable);
        },

        get imageLayers() {
            return this.layers.filter(l => l.type === 'image' && l.editable);
        },

        get canExport() {
            return this.tokenBalance >= this.tokenPrice && !this.rendering;
        },

        updateTextField(fieldKey, value) {
            this.fields[fieldKey] = value;
        },

        handleImageUpload(fieldKey, event) {
            const file = event.target.files[0];
            if (!file) return;

            this.imageFiles[fieldKey] = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreviews[fieldKey] = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        handleDrop(fieldKey, event) {
            event.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
            const file = event.dataTransfer.files[0];
            if (!file || !file.type.startsWith('image/')) return;

            this.imageFiles[fieldKey] = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreviews[fieldKey] = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        removeImage(fieldKey) {
            delete this.imagePreviews[fieldKey];
            delete this.imageFiles[fieldKey];
            // Force reactivity
            this.imagePreviews = { ...this.imagePreviews };
            this.imageFiles = { ...this.imageFiles };
        },

        getTextOverlayStyle(layer) {
            const style = {
                left: (layer.preview_x || 0) + 'px',
                top: (layer.preview_y || 0) + 'px',
                fontSize: (layer.font_size || 16) + 'px',
                color: layer.font_color || '#000000',
                textAlign: layer.text_align || 'left',
                zIndex: layer.z_index || 1,
                maxWidth: layer.preview_width ? layer.preview_width + 'px' : 'none',
                lineHeight: '1.2',
                fontWeight: 'bold'
            };

            return Object.entries(style)
                .map(([key, value]) => {
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return cssKey + ':' + value;
                })
                .join(';');
        },

        getImageOverlayStyle(layer) {
            const style = {
                left: (layer.preview_x || 0) + 'px',
                top: (layer.preview_y || 0) + 'px',
                width: (layer.preview_width || 100) + 'px',
                height: (layer.preview_height || 100) + 'px',
                zIndex: layer.z_index || 1
            };

            return Object.entries(style)
                .map(([key, value]) => {
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return cssKey + ':' + value;
                })
                .join(';');
        },

        async submitRender() {
            if (!this.canExport) return;

            this.rendering = true;
            this.renderComplete = false;
            this.renderFailed = false;
            this.renderError = '';
            this.outputUrl = null;

            const formData = new FormData();

            // Add text fields
            this.textLayers.forEach(layer => {
                if (this.fields[layer.field_key]) {
                    formData.append(layer.field_key, this.fields[layer.field_key]);
                }
            });

            // Add image files
            this.imageLayers.forEach(layer => {
                if (this.imageFiles[layer.field_key]) {
                    formData.append(layer.field_key, this.imageFiles[layer.field_key]);
                }
            });

            try {
                const response = await fetch('/templates/' + this.templateId + '/render', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    this.renderId = data.render_id;
                    this.pollRenderStatus();
                } else {
                    this.rendering = false;
                    this.renderFailed = true;
                    this.renderError = data.message || 'Co loi xay ra';
                }
            } catch (error) {
                this.rendering = false;
                this.renderFailed = true;
                this.renderError = 'Loi ket noi. Vui long thu lai.';
            }
        },

        pollRenderStatus() {
            if (this.pollInterval) {
                clearInterval(this.pollInterval);
            }

            this.pollInterval = setInterval(async () => {
                try {
                    const response = await fetch('/renders/' + this.renderId + '/status', {
                        headers: {
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });

                    const data = await response.json();

                    if (data.status === 'completed') {
                        clearInterval(this.pollInterval);
                        this.pollInterval = null;
                        this.rendering = false;
                        this.renderComplete = true;
                        this.outputUrl = data.download_url;
                        this.tokenBalance -= this.tokenPrice;
                    } else if (data.status === 'failed') {
                        clearInterval(this.pollInterval);
                        this.pollInterval = null;
                        this.rendering = false;
                        this.renderFailed = true;
                        this.renderError = data.error || 'Render that bai. Token da duoc hoan lai.';
                    }
                } catch (error) {
                    // Keep polling on network errors
                }
            }, 2000);
        },

        async submitAiCommand() {
            if (!this.aiCommand || this.aiLoading) return;

            this.aiLoading = true;

            try {
                const response = await fetch('/ai/editor-command', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        template_id: this.templateId,
                        command: this.aiCommand
                    })
                });

                const data = await response.json();

                if (data.success && data.actions) {
                    this.applyAiActions(data.actions);
                    this.aiCommand = '';
                }
            } catch (error) {
                // Silently fail for AI commands
            } finally {
                this.aiLoading = false;
            }
        },

        applyAiActions(actions) {
            actions.forEach(action => {
                this.aiActions.push(action);

                switch (action.action) {
                    case 'update_text':
                        if (action.field_key && action.value !== undefined) {
                            this.fields[action.field_key] = action.value;
                        }
                        break;

                    case 'update_style':
                        if (action.field_key) {
                            const layer = this.layers.find(l => l.field_key === action.field_key);
                            if (layer) {
                                if (action.font_color) layer.font_color = action.font_color;
                                if (action.font_size) layer.font_size = action.font_size;
                                if (action.text_align) layer.text_align = action.text_align;
                            }
                        }
                        break;

                    case 'update_transform':
                        if (action.field_key) {
                            const layer = this.layers.find(l => l.field_key === action.field_key);
                            if (layer) {
                                if (action.preview_x !== undefined) layer.preview_x = action.preview_x;
                                if (action.preview_y !== undefined) layer.preview_y = action.preview_y;
                                if (action.preview_width !== undefined) layer.preview_width = action.preview_width;
                                if (action.preview_height !== undefined) layer.preview_height = action.preview_height;
                            }
                        }
                        break;

                    case 'update_image_adjustment':
                        if (action.field_key) {
                            const layer = this.layers.find(l => l.field_key === action.field_key);
                            if (layer) {
                                if (action.brightness !== undefined) layer.brightness = action.brightness;
                                if (action.contrast !== undefined) layer.contrast = action.contrast;
                                if (action.saturation !== undefined) layer.saturation = action.saturation;
                            }
                        }
                        break;
                }
            });

            // Force Alpine.js reactivity
            this.layers = [...this.layers];
            this.fields = { ...this.fields };
        }
    };
}
