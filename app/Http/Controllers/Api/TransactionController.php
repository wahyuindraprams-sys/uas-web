<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Repositories\CustomerRepositoryInterface;
use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\TransactionHeader;
use App\Services\InvoiceNumberService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransactionController extends Controller
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly InvoiceNumberService $invoiceNumberService,
        private readonly TransactionService $transactionService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $transactions = $this->transactionRepository->all();

        return TransactionResource::collection($transactions);
    }

    public function store(StoreTransactionRequest $request): TransactionResource
    {
        $data = $request->validated();
        $customer = $this->customerRepository->findByKode($data['kode_customer']);

        $headerData = [
            'no_inv' => $this->invoiceNumberService->generate(),
            'kode_customer' => $customer->kode_customer,
            'nama_customer' => $customer->nama_customer,
            'alamat_customer' => implode(', ', array_filter([
                $customer->alamat,
                $customer->kelurahan,
                $customer->kecamatan,
                $customer->kota,
                $customer->provinsi,
                $customer->kode_pos,
            ])),
            'tgl_inv' => $data['tgl_inv'],
            'total' => 0,
        ];

        $detailsData = array_map(function ($detail) {
            $product = $this->productRepository->findByKode($detail['kode_produk']);
            $detail['nama_produk'] = $product->nama_produk;

            return $this->transactionService->prepareDetail($detail);
        }, $data['details']);

        $transaction = $this->transactionRepository->create($headerData, $detailsData);

        return new TransactionResource($transaction);
    }

    public function show(TransactionHeader $transaction): TransactionResource
    {
        return new TransactionResource($transaction->load('details'));
    }

    public function update(UpdateTransactionRequest $request, TransactionHeader $transaction): TransactionResource
    {
        $data = $request->validated();
        $customer = $this->customerRepository->findByKode($data['kode_customer']);

        $headerData = [
            'kode_customer' => $customer->kode_customer,
            'nama_customer' => $customer->nama_customer,
            'alamat_customer' => implode(', ', array_filter([
                $customer->alamat,
                $customer->kelurahan,
                $customer->kecamatan,
                $customer->kota,
                $customer->provinsi,
                $customer->kode_pos,
            ])),
            'tgl_inv' => $data['tgl_inv'],
            'total' => 0,
        ];

        $detailsData = array_map(function ($detail) {
            $product = $this->productRepository->findByKode($detail['kode_produk']);
            $detail['nama_produk'] = $product->nama_produk;

            return $this->transactionService->prepareDetail($detail);
        }, $data['details']);

        $transaction = $this->transactionRepository->update($transaction, $headerData, $detailsData);

        return new TransactionResource($transaction);
    }

    public function destroy(TransactionHeader $transaction): JsonResponse
    {
        $this->transactionRepository->delete($transaction);

        return response()->json(['message' => 'Transaksi berhasil dihapus.']);
    }

    public function generateInvNumber(): JsonResponse
    {
        return response()->json(['no_inv' => $this->invoiceNumberService->generate()]);
    }
}
