<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = ['name', 'sku', 'category', 'quantity', 'price', 'status'];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price' => 'float',
        ];
    }
}
