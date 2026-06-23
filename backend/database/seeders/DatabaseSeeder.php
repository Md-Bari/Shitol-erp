<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\FinanceTransaction;
use App\Models\InventoryItem;
use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUsers();
        $this->seedInventory();
        $this->seedOrders();
        $this->seedCustomers();
        $this->seedEmployees();
        $this->seedFinance();
        $this->seedNotifications();
    }

    private function seedUsers(): void
    {
        $users = [
            ['name' => 'ERP Admin', 'email' => 'admin@erp.com', 'password' => 'admin123', 'role' => 'admin'],
            ['name' => 'Operations Manager', 'email' => 'manager@erp.com', 'password' => 'manager123', 'role' => 'manager'],
            ['name' => 'ERP User', 'email' => 'user@erp.com', 'password' => 'user123', 'role' => 'user'],
        ];

        foreach ($users as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                    'status' => 'active',
                ],
            );
        }
    }

    private function seedInventory(): void
    {
        $items = [
            ['name' => 'Cotton Fabric Roll', 'sku' => 'FAB-COT-001', 'category' => 'Raw Materials', 'quantity' => 120, 'price' => 48.50, 'status' => 'in-stock'],
            ['name' => 'Denim Fabric Roll', 'sku' => 'FAB-DEN-002', 'category' => 'Raw Materials', 'quantity' => 18, 'price' => 62.00, 'status' => 'low-stock'],
            ['name' => 'Industrial Thread Pack', 'sku' => 'THR-IND-010', 'category' => 'Accessories', 'quantity' => 240, 'price' => 6.75, 'status' => 'in-stock'],
            ['name' => 'Metal Button Set', 'sku' => 'BTN-MTL-044', 'category' => 'Accessories', 'quantity' => 0, 'price' => 3.25, 'status' => 'out-of-stock'],
        ];

        foreach ($items as $item) {
            InventoryItem::query()->updateOrCreate(['sku' => $item['sku']], $item);
        }
    }

    private function seedOrders(): void
    {
        $orders = [
            [
                'order_number' => 'ORD-20260623-0001',
                'customer_name' => 'Northstar Retail',
                'email' => 'buyer@northstar.example',
                'phone' => '+1 555 0123',
                'status' => 'processing',
                'order_date' => '2026-06-18',
                'delivery_date' => '2026-06-28',
                'shipping_address' => '120 Market Street, Dallas, TX',
                'items' => [
                    ['product_name' => 'Cotton Shirt Batch', 'quantity' => 80, 'price' => 22.50],
                    ['product_name' => 'Denim Jacket Batch', 'quantity' => 20, 'price' => 58.00],
                ],
            ],
            [
                'order_number' => 'ORD-20260623-0002',
                'customer_name' => 'Metro Apparel',
                'email' => 'orders@metroapparel.example',
                'phone' => '+1 555 0188',
                'status' => 'delivered',
                'order_date' => '2026-06-11',
                'delivery_date' => '2026-06-20',
                'shipping_address' => '44 Commerce Ave, New York, NY',
                'items' => [
                    ['product_name' => 'Polo Shirt Batch', 'quantity' => 150, 'price' => 18.25],
                ],
            ],
        ];

        foreach ($orders as $entry) {
            $items = $entry['items'];
            unset($entry['items']);
            $entry['total'] = collect($items)->sum(fn (array $item) => $item['quantity'] * $item['price']);
            $order = Order::query()->updateOrCreate(['order_number' => $entry['order_number']], $entry);
            $order->items()->delete();

            foreach ($items as $item) {
                $order->items()->create($item);
            }
        }
    }

    private function seedCustomers(): void
    {
        $customers = [
            ['name' => 'Ariana Brooks', 'email' => 'ariana@northstar.example', 'phone' => '+1 555 0134', 'company' => 'Northstar Retail', 'status' => 'customer', 'value' => 46000, 'last_contact' => '2026-06-20'],
            ['name' => 'Daniel Kim', 'email' => 'daniel@metroapparel.example', 'phone' => '+1 555 0198', 'company' => 'Metro Apparel', 'status' => 'customer', 'value' => 72000, 'last_contact' => '2026-06-19'],
            ['name' => 'Maya Chen', 'email' => 'maya@urbanlane.example', 'phone' => '+1 555 0148', 'company' => 'Urban Lane', 'status' => 'prospect', 'value' => 28000, 'last_contact' => '2026-06-17'],
        ];

        foreach ($customers as $customer) {
            Customer::query()->updateOrCreate(['email' => $customer['email']], $customer);
        }
    }

    private function seedEmployees(): void
    {
        $employees = [
            ['name' => 'Nadia Rahman', 'email' => 'nadia@erp.com', 'phone' => '+880 1700 000001', 'department' => 'Production', 'position' => 'Production Lead', 'salary' => 52000, 'hire_date' => '2023-02-15', 'status' => 'active'],
            ['name' => 'Rafi Ahmed', 'email' => 'rafi@erp.com', 'phone' => '+880 1700 000002', 'department' => 'Finance', 'position' => 'Accountant', 'salary' => 47000, 'hire_date' => '2022-08-01', 'status' => 'active'],
            ['name' => 'Samira Khan', 'email' => 'samira@erp.com', 'phone' => '+880 1700 000003', 'department' => 'Sales', 'position' => 'Sales Executive', 'salary' => 43000, 'hire_date' => '2024-01-10', 'status' => 'on-leave'],
        ];

        foreach ($employees as $employee) {
            Employee::query()->updateOrCreate(['email' => $employee['email']], $employee);
        }
    }

    private function seedFinance(): void
    {
        $transactions = [
            ['type' => 'income', 'category' => 'Sales', 'description' => 'Northstar invoice payment', 'amount' => 2960, 'transaction_date' => '2026-06-21', 'status' => 'completed'],
            ['type' => 'income', 'category' => 'Sales', 'description' => 'Metro Apparel invoice payment', 'amount' => 2737.50, 'transaction_date' => '2026-06-20', 'status' => 'completed'],
            ['type' => 'expense', 'category' => 'Materials', 'description' => 'Fabric supplier payment', 'amount' => 1800, 'transaction_date' => '2026-06-18', 'status' => 'completed'],
        ];

        foreach ($transactions as $transaction) {
            FinanceTransaction::query()->firstOrCreate($transaction);
        }
    }

    private function seedNotifications(): void
    {
        $notifications = [
            ['title' => 'Low Stock Alert', 'message' => 'Denim Fabric Roll has 18 units available.', 'type' => 'warning', 'category' => 'low_stock'],
            ['title' => 'Out of Stock Alert', 'message' => 'Metal Button Set has 0 units available.', 'type' => 'error', 'category' => 'out_of_stock'],
        ];

        foreach ($notifications as $notification) {
            Notification::query()->firstOrCreate($notification);
        }
    }
}
