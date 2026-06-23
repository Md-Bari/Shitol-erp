<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'company', 'status', 'value', 'last_contact'];

    protected function casts(): array
    {
        return [
            'value' => 'float',
            'last_contact' => 'date:Y-m-d',
        ];
    }
}
