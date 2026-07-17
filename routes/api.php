<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('api.token')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('products', ProductController::class)->names('api.products');
    Route::apiResource('customers', CustomerController::class)->names('api.customers');
    Route::apiResource('transactions', TransactionController::class)->names('api.transactions');
    Route::get('generate-inv', [TransactionController::class, 'generateInvNumber']);
});
