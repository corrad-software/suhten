<?php

/**
 * Copy all application tables from local SQLite into the default (pgsql) connection.
 * Run after: php artisan migrate
 *
 * Usage: php scripts/migrate-sqlite-to-pgsql.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$sqlitePath = database_path('database.sqlite');
if (! file_exists($sqlitePath)) {
    fwrite(STDERR, "SQLite file not found: {$sqlitePath}\n");
    exit(1);
}

config([
    'database.connections.sqlite_source' => [
        'driver' => 'sqlite',
        'database' => $sqlitePath,
        'prefix' => '',
        'foreign_key_constraints' => false,
    ],
]);

DB::purge('sqlite_source');

$source = DB::connection('sqlite_source');
$target = DB::connection(); // default = pgsql from .env

if ($target->getDriverName() !== 'pgsql') {
    fwrite(STDERR, 'Default connection is not pgsql (got ' . $target->getDriverName() . "). Check .env.\n");
    exit(1);
}

// Dependency-friendly order (parents before children)
$preferredOrder = [
    'migrations',
    'roles',
    'users',
    'password_reset_tokens',
    'sessions',
    'cache',
    'cache_locks',
    'jobs',
    'job_batches',
    'failed_jobs',
    'media',
    'posts',
    'categories',
    'category_post',
    'pages',
    'settings',
    'audit_logs',
    'personal_access_tokens',
];

$existing = $source->select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
$allTables = array_map(fn ($r) => $r->name, $existing);

$tables = [];
foreach ($preferredOrder as $t) {
    if (in_array($t, $allTables, true)) {
        $tables[] = $t;
    }
}
foreach ($allTables as $t) {
    if (! in_array($t, $tables, true)) {
        $tables[] = $t;
    }
}

echo "Source: SQLite ({$sqlitePath})\n";
echo 'Target: ' . $target->getDriverName() . ' / ' . config('database.connections.' . config('database.default') . '.database') . "\n\n";

$summary = [];

// Clear target tables in reverse dependency order (children before parents)
foreach (array_reverse($tables) as $table) {
    if (! Schema::connection(config('database.default'))->hasTable($table)) {
        continue;
    }
    $target->table($table)->delete();
}

foreach ($tables as $table) {
    if (! Schema::connection(config('database.default'))->hasTable($table)) {
        echo "SKIP {$table} (missing on target)\n";
        $summary[$table] = 'skipped-missing';
        continue;
    }

    $rows = $source->table($table)->get();
    $count = $rows->count();

    if ($count === 0) {
        echo "OK   {$table}: 0 rows\n";
        $summary[$table] = 0;
        continue;
    }

    $columns = Schema::connection(config('database.default'))->getColumnListing($table);
    $chunk = [];
    $inserted = 0;

    foreach ($rows as $row) {
        $data = (array) $row;
        // Keep only columns that exist on target
        $data = array_intersect_key($data, array_flip($columns));
        $chunk[] = $data;

        if (count($chunk) >= 100) {
            $target->table($table)->insert($chunk);
            $inserted += count($chunk);
            $chunk = [];
        }
    }

    if ($chunk !== []) {
        $target->table($table)->insert($chunk);
        $inserted += count($chunk);
    }

    // Reset serial sequences for tables with id
    if (in_array('id', $columns, true)) {
        $seq = $target->selectOne("SELECT pg_get_serial_sequence(?, 'id') AS seq", [$table]);
        if ($seq && $seq->seq) {
            $target->statement(
                'SELECT setval(?, COALESCE((SELECT MAX(id) FROM "' . $table . '"), 1), true)',
                [$seq->seq]
            );
        }
    }

    echo "OK   {$table}: {$inserted} rows\n";
    $summary[$table] = $inserted;
}

echo "\nDone. Tables copied: " . count(array_filter($summary, fn ($v) => is_int($v))) . "\n";
