<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'kode_customer' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9]+$/', "unique:customers,kode_customer,{$customerId}"],
            'nama_customer' => ['required', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'provinsi' => ['nullable', 'string', 'max:100'],
            'kota' => ['nullable', 'string', 'max:100'],
            'kecamatan' => ['nullable', 'string', 'max:100'],
            'kelurahan' => ['nullable', 'string', 'max:100'],
            'kode_pos' => ['nullable', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_customer.regex' => 'Kode customer hanya boleh berisi huruf dan angka (alphanumeric).',
            'kode_customer.unique' => 'Kode customer sudah digunakan.',
        ];
    }
}
