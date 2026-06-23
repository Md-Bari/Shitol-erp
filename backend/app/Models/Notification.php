<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['title', 'message', 'type', 'category', 'read'];

    protected function casts(): array
    {
        return [
            'read' => 'boolean',
        ];
    }
}
