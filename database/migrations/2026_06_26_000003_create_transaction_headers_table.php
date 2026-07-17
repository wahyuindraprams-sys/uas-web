<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_headers', function (Blueprint $table) {
            $table->id();
            $table->string('no_inv', 30)->unique();
            $table->string('kode_customer', 50);
            $table->string('nama_customer', 255);
            $table->text('alamat_customer')->nullable();
            $table->date('tgl_inv');
            $table->decimal('total', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('kode_customer')->references('kode_customer')->on('customers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_headers');
    }
};
