<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RedemptionCode;
use App\Services\RedemptionCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedemptionCodeController extends Controller
{
    protected RedemptionCodeService $service;

    public function __construct()
    {
        $this->service = new RedemptionCodeService();
    }

    /**
     * Display all codes with pagination, search, and status filter.
     */
    public function index(Request $request)
    {
        $query = RedemptionCode::with(['usedBy', 'createdBy'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhereHas('usedBy', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $codes = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => RedemptionCode::count(),
            'active' => RedemptionCode::active()->count(),
            'used' => RedemptionCode::used()->count(),
            'disabled' => RedemptionCode::disabled()->count(),
        ];

        return view('admin.codes.index', compact('codes', 'stats'));
    }

    /**
     * Show create form (single or bulk).
     */
    public function create()
    {
        return view('admin.codes.create');
    }

    /**
     * Store a single code.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', 'unique:redemption_codes,code'],
            'token_amount' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        RedemptionCode::create([
            'code' => strtoupper($validated['code']),
            'token_amount' => $validated['token_amount'],
            'status' => RedemptionCode::STATUS_ACTIVE,
            'created_by' => Auth::id(),
            'note' => $validated['note'],
        ]);

        return redirect()->route('admin.codes.index')->with('success', 'Tao code thanh cong.');
    }

    /**
     * Bulk generate codes.
     */
    public function bulkGenerate(Request $request)
    {
        $validated = $request->validate([
            'count' => ['required', 'integer', 'min:1', 'max:100'],
            'token_amount' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $codes = $this->service->generateCodes(
            $validated['count'],
            $validated['token_amount'],
            Auth::id(),
            $validated['note']
        );

        return redirect()->route('admin.codes.index')
            ->with('success', "Da tao {$validated['count']} code thanh cong.");
    }

    /**
     * Full redemption history with filters.
     */
    public function history(Request $request)
    {
        $query = RedemptionCode::with(['usedBy', 'createdBy'])
            ->where('status', RedemptionCode::STATUS_USED)
            ->latest('used_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhereHas('usedBy', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('date_from')) {
            $query->where('used_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('used_at', '<=', $request->date_to . ' 23:59:59');
        }

        $codes = $query->paginate(20)->withQueryString();

        return view('admin.codes.history', compact('codes'));
    }

    /**
     * Show single code detail.
     */
    public function show(RedemptionCode $redemptionCode)
    {
        $redemptionCode->load(['usedBy', 'createdBy']);

        return view('admin.codes.show', compact('redemptionCode'));
    }

    /**
     * Disable a code.
     */
    public function disable(RedemptionCode $redemptionCode)
    {
        try {
            $this->service->disableCode($redemptionCode);
            return redirect()->route('admin.codes.index')
                ->with('success', "Code {$redemptionCode->code} da bi vo hieu hoa.");
        } catch (\RuntimeException $e) {
            return redirect()->route('admin.codes.index')
                ->with('error', $e->getMessage());
        }
    }
}
