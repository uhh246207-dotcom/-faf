{{-- Redeem Code Section - Uses Alpine.js for AJAX submission --}}
<div x-data="{
    code: '',
    loading: false,
    message: '',
    success: false,
    async redeemCode() {
        if (!this.code.trim()) return;
        this.loading = true;
        this.message = '';
        this.success = false;

        try {
            const response = await fetch('{{ route('redeem-code') }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').getAttribute('content'),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ code: this.code.trim() })
            });

            const data = await response.json();

            if (data.success) {
                this.success = true;
                this.message = data.message;
                this.code = '';
                // Update token balance if displayed on page
                if (typeof updateTokenBalance === 'function') {
                    updateTokenBalance(data.new_balance);
                }
                // Dispatch event for other components
                window.dispatchEvent(new CustomEvent('token-balance-updated', { detail: { balance: data.new_balance } }));
            } else {
                this.success = false;
                this.message = data.message || 'Co loi xay ra.';
            }
        } catch (error) {
            this.success = false;
            this.message = 'Khong the ket noi. Vui long thu lai.';
        } finally {
            this.loading = false;
        }
    }
}" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Doi code nap token</h3>
    <p class="text-sm text-gray-500 mb-4">Nhap ma code de nhan token mien phi</p>

    <div class="flex space-x-2">
        <input type="text" x-model="code" placeholder="Nhap ma code..."
               @keydown.enter.prevent="redeemCode()"
               :disabled="loading"
               class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase font-mono">
        <button @click="redeemCode()" :disabled="loading || !code.trim()"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap">
            <span x-show="!loading">Doi code</span>
            <span x-show="loading" class="flex items-center">
                <svg class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                ...
            </span>
        </button>
    </div>

    <!-- Success Message -->
    <div x-show="message && success" x-transition
         class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
            <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="text-sm text-green-800" x-text="message"></span>
        </div>
    </div>

    <!-- Error Message -->
    <div x-show="message && !success" x-transition
         class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
            <svg class="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-800" x-text="message"></span>
        </div>
    </div>
</div>
