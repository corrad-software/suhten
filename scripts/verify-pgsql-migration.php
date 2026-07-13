<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$sqlitePath = database_path('database.sqlite');
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
$target = DB::connection();

echo 'Default driver: ' . $target->getDriverName() . PHP_EOL;
echo 'DB: ' . config('database.connections.pgsql.database') . PHP_EOL;
echo 'Host: ' . config('database.connections.pgsql.host') . ':' . config('database.connections.pgsql.port') . PHP_EOL;
echo PHP_EOL;

$tables = $source->select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
$ok = true;
foreach ($tables as $row) {
    $t = $row->name;
    $src = (int) $source->table($t)->count();
    $dst = (int) $target->table($t)->count();
    $mark = $src === $dst ? 'OK' : 'MISMATCH';
    if ($src !== $dst) {
        $ok = false;
    }
    echo sprintf("%-28s sqlite=%-4d pgsql=%-4d %s\n", $t, $src, $dst, $mark);
}

echo PHP_EOL;
echo $ok ? "All counts match.\n" : "Some counts differ.\n";
exit($ok ? 0 : 1);
