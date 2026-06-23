<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Order::query()->with('items')->latest()->get()->map(fn (Order $order) => $this->payload($order)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);

        $order = DB::transaction(function () use ($data) {
            $items = collect($data['items']);
            $total = $items->sum(fn (array $item) => $item['quantity'] * $item['price']);

            $order = Order::query()->create([
                'order_number' => $data['order_number'] ?? $this->nextOrderNumber(),
                'customer_name' => $data['customer_name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'total' => $total,
                'status' => $data['status'] ?? 'pending',
                'order_date' => $data['order_date'],
                'delivery_date' => $data['delivery_date'] ?: null,
                'shipping_address' => $data['shipping_address'],
            ]);

            foreach ($items as $item) {
                $order->items()->create($item);
            }

            return $order->fresh('items');
        });

        return response()->json(['data' => $this->payload($order)], 201);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'status' => ['sometimes', 'required', 'in:pending,processing,shipped,delivered,cancelled'],
            'delivery_date' => ['nullable', 'date'],
        ]);

        $order->update($data);

        if (isset($data['status']) && in_array($data['status'], ['shipped', 'delivered'], true)) {
            Notification::query()->create([
                'title' => 'Order Status Updated',
                'message' => "Order {$order->order_number} is now {$data['status']}.",
                'type' => 'info',
                'category' => $data['status'] === 'delivered' ? 'delivery_arrived' : 'delivery_approaching',
            ]);
        }

        return response()->json(['data' => $this->payload($order->fresh('items'))]);
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'order_number' => ['nullable', 'string', 'max:255', 'unique:orders,order_number'],
            'customer_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'shipping_address' => ['required', 'string'],
            'order_date' => ['required', 'date'],
            'delivery_date' => ['nullable', 'date'],
            'status' => ['nullable', 'in:pending,processing,shipped,delivered,cancelled'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_name' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
        ]);
    }

    private function payload(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'email' => $order->email,
            'phone' => $order->phone,
            'items' => $order->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
            ])->values(),
            'total' => (float) $order->total,
            'status' => $order->status,
            'order_date' => $order->order_date?->format('Y-m-d'),
            'delivery_date' => $order->delivery_date?->format('Y-m-d'),
            'shipping_address' => $order->shipping_address,
        ];
    }

    private function nextOrderNumber(): string
    {
        return 'ORD-'.now()->format('Ymd').'-'.str_pad((string) (Order::query()->count() + 1), 4, '0', STR_PAD_LEFT);
    }
}
