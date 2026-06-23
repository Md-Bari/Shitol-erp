<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => InventoryItem::query()->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:inventory_items,sku'],
            'category' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:in-stock,low-stock,out-of-stock'],
        ]);

        $data['status'] = $data['status'] ?? $this->statusForQuantity((int) $data['quantity']);
        $item = InventoryItem::query()->create($data);
        $this->notifyStockState($item);

        return response()->json(['data' => $item], 201);
    }

    public function update(Request $request, InventoryItem $inventoryItem): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sku' => ['sometimes', 'required', 'string', 'max:255', 'unique:inventory_items,sku,'.$inventoryItem->id],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'quantity' => ['sometimes', 'required', 'integer', 'min:0'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:in-stock,low-stock,out-of-stock'],
        ]);

        if (array_key_exists('quantity', $data) && empty($data['status'])) {
            $data['status'] = $this->statusForQuantity((int) $data['quantity']);
        }

        $inventoryItem->update($data);
        $this->notifyStockState($inventoryItem);

        return response()->json(['data' => $inventoryItem->fresh()]);
    }

    public function destroy(InventoryItem $inventoryItem): JsonResponse
    {
        $inventoryItem->delete();

        return response()->json(null, 204);
    }

    private function statusForQuantity(int $quantity): string
    {
        if ($quantity === 0) {
            return 'out-of-stock';
        }

        return $quantity < 20 ? 'low-stock' : 'in-stock';
    }

    private function notifyStockState(InventoryItem $item): void
    {
        if ($item->status === 'low-stock' || $item->status === 'out-of-stock') {
            Notification::query()->create([
                'title' => $item->status === 'low-stock' ? 'Low Stock Alert' : 'Out of Stock Alert',
                'message' => "{$item->name} has {$item->quantity} units available.",
                'type' => $item->status === 'low-stock' ? 'warning' : 'error',
                'category' => str_replace('-', '_', $item->status),
            ]);
        }
    }
}
