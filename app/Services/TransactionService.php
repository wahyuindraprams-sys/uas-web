<?php

namespace App\Services;

class TransactionService
{
    public function calculateHargaNet(float $harga, float $disc1, float $disc2, float $disc3): float
    {
        $net = $harga * (1 - $disc1 / 100) * (1 - $disc2 / 100) * (1 - $disc3 / 100);

        return round($net, 2);
    }

    public function calculateJumlah(float $hargaNet, int $qty): float
    {
        return round($hargaNet * $qty, 2);
    }

    public function prepareDetail(array $detail): array
    {
        $hargaNet = $this->calculateHargaNet(
            (float) $detail['harga'],
            (float) ($detail['disc1'] ?? 0),
            (float) ($detail['disc2'] ?? 0),
            (float) ($detail['disc3'] ?? 0),
        );

        return array_merge($detail, [
            'disc1' => $detail['disc1'] ?? 0,
            'disc2' => $detail['disc2'] ?? 0,
            'disc3' => $detail['disc3'] ?? 0,
            'harga_net' => $hargaNet,
            'jumlah' => $this->calculateJumlah($hargaNet, (int) $detail['qty']),
        ]);
    }
}
