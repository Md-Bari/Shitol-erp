<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\FinanceTransaction;
use App\Models\InventoryItem;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $revenue = (float) Order::query()->whereIn('status', ['processing', 'shipped', 'delivered'])->sum('total');
        $expenses = (float) FinanceTransaction::query()->where('type', 'expense')->sum('amount');

        return response()->json([
            'stats' => [
                ['title' => 'Total Revenue', 'value' => $revenue, 'change' => '+12.5%', 'trending' => 'up'],
                ['title' => 'Total Orders', 'value' => Order::query()->count(), 'change' => '+8.2%', 'trending' => 'up'],
                ['title' => 'Inventory Items', 'value' => InventoryItem::query()->count(), 'change' => '-2.4%', 'trending' => 'down'],
                ['title' => 'Active Employees', 'value' => Employee::query()->where('status', 'active')->count(), 'change' => '+5.1%', 'trending' => 'up'],
            ],
            'revenue_vs_expenses' => $this->monthlyData(),
            'sales_by_category' => InventoryItem::query()
                ->selectRaw('category as name, count(*) as value')
                ->groupBy('category')
                ->orderByDesc('value')
                ->get()
                ->map(fn ($row) => ['name' => $row->name, 'value' => (int) $row->value]),
            'monthly_performance' => $this->monthlyData(),
            'crm_summary' => [
                'contacts' => Customer::query()->count(),
                'customers' => Customer::query()->where('status', 'customer')->count(),
            ],
        ]);
    }

    private function monthlyData(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        return collect($months)->map(fn (string $month, int $index) => [
            'month' => $month,
            'revenue' => 42000 + ($index * 5200),
            'expenses' => 28000 + ($index * 2600),
        ])->all();
    }
}
