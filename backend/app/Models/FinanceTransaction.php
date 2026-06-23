<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinanceTransaction extends Model
{
    protected $fillable = ['type', 'category', 'description', 'amount', 'transaction_date', 'status'];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'transaction_date' => 'date:Y-m-d',
        ];
    }
}
