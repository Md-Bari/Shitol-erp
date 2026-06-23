<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinanceTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinanceTransactionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => FinanceTransaction::query()->latest('transaction_date')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:income,expense'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'transaction_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,completed,cancelled'],
        ]);

        return response()->json(['data' => FinanceTransaction::query()->create($data)], 201);
    }

    public function update(Request $request, FinanceTransaction $transaction): JsonResponse
    {
        $transaction->update($request->all());

        return response()->json(['data' => $transaction->fresh()]);
    }

    public function destroy(FinanceTransaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json(null, 204);
    }
}
