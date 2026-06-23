<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_name',
        'email',
        'phone',
        'total',
        'status',
        'order_date',
        'delivery_date',
        'shipping_address',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'float',
            'order_date' => 'date:Y-m-d',
            'delivery_date' => 'date:Y-m-d',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
