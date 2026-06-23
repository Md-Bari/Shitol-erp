<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'department', 'position', 'salary', 'hire_date', 'status'];

    protected function casts(): array
    {
        return [
            'salary' => 'float',
            'hire_date' => 'date:Y-m-d',
        ];
    }
}
