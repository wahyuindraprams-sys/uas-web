<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->string('no_inv', 30);
            $table->string('kode_produk', 50);
            $table->string('nama_produk', 255);
            $table->integer('qty');
            $table->decimal('harga', 15, 2);
            $table->decimal('disc1', 5, 2)->default(0);
            $table->decimal('disc2', 5, 2)->default(0);
            $table->decimal('disc3', 5, 2)->default(0);
            $table->decimal('harga_net', 15, 2);
            $table->decimal('jumlah', 15, 2);
            $table->timestamps();

            $table->foreign('no_inv')->references('no_inv')->on('transaction_headers');
            $table->foreign('kode_produk')->references('kode_produk')->on('products');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_details');
    }
};
