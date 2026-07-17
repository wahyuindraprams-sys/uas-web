<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\CustomerRepositoryInterface;
use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Models\TransactionHeader;
use App\Services\InvoiceNumberService;
use App\Services\TransactionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly CustomerRepositoryInterface $customerRepository,
        private readonly InvoiceNumberService $invoiceNumberService,
        private readonly TransactionService $transactionService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('transactions/index', [
            'transactions' => $this->transactionRepository->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('transactions/create', [
            'products' => $this->productRepository->all(),
            'customers' => $this->customerRepository->all(),
            'no_inv' => $this->invoiceNumberService->generate(),
        ]);
    }

    public function store(StoreTransactionRequest $request): RedirectResponse
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

        $this->transactionRepository->create($headerData, $detailsData);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaksi berhasil disimpan.']);

        return to_route('transactions.index');
    }

    public function show(TransactionHeader $transaction): Response
    {
        return Inertia::render('transactions/show', [
            'transaction' => $transaction->load('details'),
        ]);
    }

    public function edit(TransactionHeader $transaction): Response
    {
        return Inertia::render('transactions/edit', [
            'transaction' => $transaction->load('details'),
            'products' => $this->productRepository->all(),
            'customers' => $this->customerRepository->all(),
        ]);
    }

    public function update(UpdateTransactionRequest $request, TransactionHeader $transaction): RedirectResponse
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

        $this->transactionRepository->update($transaction, $headerData, $detailsData);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaksi berhasil diperbarui.']);

        return to_route('transactions.index');
    }

    public function destroy(TransactionHeader $transaction): RedirectResponse
    {
        $this->transactionRepository->delete($transaction);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transaksi berhasil dihapus.']);

        return to_route('transactions.index');
    }
}
