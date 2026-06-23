<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\FinanceTransactionController;
use App\Http\Controllers\Api\InventoryItemController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('cors')->group(function () {
    Route::options('/{any}', fn () => response('', 204))->where('any', '.*');
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('api.auth')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard', DashboardController::class);

        Route::apiResource('inventory-items', InventoryItemController::class)
            ->except(['show'])
            ->parameters(['inventory-items' => 'inventoryItem']);
        Route::apiResource('orders', OrderController::class)->except(['show']);
        Route::apiResource('customers', CustomerController::class)->except(['show']);
        Route::apiResource('employees', EmployeeController::class)->except(['show']);
        Route::apiResource('transactions', FinanceTransactionController::class)
            ->except(['show'])
            ->parameters(['transactions' => 'transaction']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{user}/status', [UserController::class, 'updateStatus']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    });
});
