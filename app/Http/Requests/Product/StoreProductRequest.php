<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_produk' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9]+$/', 'unique:products,kode_produk'],
            'nama_produk' => ['required', 'string', 'max:255'],
            'harga' => ['required', 'numeric', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_produk.regex' => 'Kode produk hanya boleh berisi huruf dan angka (alphanumeric).',
            'kode_produk.unique' => 'Kode produk sudah digunakan.',
        ];
    }
}
