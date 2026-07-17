<?php

namespace App\Http\Requests\Transaction;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_customer' => ['required', 'string', 'exists:customers,kode_customer'],
            'tgl_inv' => ['required', 'date'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.kode_produk' => ['required', 'string', 'exists:products,kode_produk'],
            'details.*.qty' => ['required', 'integer', 'min:1'],
            'details.*.harga' => ['required', 'numeric', 'min:0'],
            'details.*.disc1' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'details.*.disc2' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'details.*.disc3' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $transaction = $this->route('transaction');
                $oldQtyByKode = [];
                if ($transaction) {
                    foreach ($transaction->details as $d) {
                        $oldQtyByKode[$d->kode_produk] = ($oldQtyByKode[$d->kode_produk] ?? 0) + $d->qty;
                    }
                }

                foreach ($this->input('details', []) as $index => $detail) {
                    $product = Product::where('kode_produk', $detail['kode_produk'])->first();
                    if ($product) {
                        $availableStok = $product->stok + ($oldQtyByKode[$detail['kode_produk']] ?? 0);
                        if ($detail['qty'] > $availableStok) {
                            $validator->errors()->add(
                                "details.{$index}.qty",
                                "Qty melebihi stok tersedia ({$availableStok})."
                            );
                        }
                    }
                }
            },
        ];
    }
}
