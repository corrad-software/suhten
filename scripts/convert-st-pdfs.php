<?php

/**
 * Convert all PDFs under C:\ST (excluding this repo) into Markdown under docs/.
 *
 * - Copies each PDF into docs/ mirroring the relative path under C:\ST
 * - Writes structured .md + -full-text.md beside the PDF
 * - Writes docs/PDF-INDEX.md
 *
 * Usage: php scripts/convert-st-pdfs.php
 */

ini_set('memory_limit', '2048M');
set_time_limit(0);

$repoRoot = dirname(__DIR__);
$sourceRoot = 'C:/ST';
$outputRoot = $repoRoot . '/docs';
$autoload = 'C:/Users/masri/AppData/Local/Temp/pdf-php/vendor/autoload.php';

if (!is_dir($sourceRoot)) {
    fwrite(STDERR, "Source folder not found: {$sourceRoot}\n");
    exit(1);
}

if (!file_exists($autoload)) {
    fwrite(STDERR, "Missing smalot/pdfparser. Install in temp:\n");
    fwrite(STDERR, "  cd %TEMP%/pdf-php && composer require smalot/pdfparser\n");
    exit(1);
}

require $autoload;

function slugify(string $name): string
{
    $name = preg_replace('/\.pdf$/i', '', $name);
    $name = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) ?: $name;
    $name = strtolower($name);
    $name = preg_replace('/[^a-z0-9]+/', '-', $name);
    return trim($name, '-') ?: 'document';
}

function cleanPageText(string $text): string
{
    $text = preg_replace('/D03[^\n]*Muka surat[^\n]*/i', '', $text) ?? $text;
    $text = str_replace(["\x{FFFC}", '￼'], '', $text);
    $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
    $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;
    return trim($text);
}

function formatBullets(string $text): string
{
    return trim(preg_replace('/\s*•\s*/', "\n- ", $text) ?? $text);
}

/** @return Generator<string> */
function findPdfs(string $root): Generator
{
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        /** @var SplFileInfo $file */
        if (!$file->isFile()) {
            continue;
        }
        if (strtolower($file->getExtension()) !== 'pdf') {
            continue;
        }

        $path = str_replace('\\', '/', $file->getPathname());
        // Skip the git repo itself (already has docs/ copies / would recurse)
        if (stripos($path, '/suhten-repo/') !== false) {
            continue;
        }

        yield $path;
    }
}

function relativeFrom(string $absolute, string $root): string
{
    $absolute = str_replace('\\', '/', $absolute);
    $root = rtrim(str_replace('\\', '/', $root), '/') . '/';
    if (stripos($absolute, $root) === 0) {
        return substr($absolute, strlen($root));
    }
    return basename($absolute);
}

function ensureDir(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0777, true) && !is_dir($dir)) {
        throw new RuntimeException("Cannot create directory: {$dir}");
    }
}

function aboutBlurb(string $pdfName): ?string
{
    $n = strtoupper($pdfName);
    return match (true) {
        str_contains($n, 'APPENDIX G') => '**Appendix G — Keterangan Modul**. Module descriptions for Sistem Digital ST.',
        str_contains($n, 'APPENDIX H') => '**Appendix H — List of Integration**. External system integrations.',
        str_contains($n, 'APPENDIX I') => '**Appendix I — Akronim**. Glossary of acronyms.',
        str_contains($n, 'APPENDIX D1') || preg_match('/\bD1\b/', $n) === 1 => '**Appendix D1 — Jadual Pematuhan Spesifikasi Fungsi**.',
        str_contains($n, 'APPENDIX D2') || preg_match('/\bD2\b/', $n) === 1 => '**Appendix D2 — Jadual Pematuhan Spesifikasi Teknikal**.',
        str_contains($n, 'APPENDIX D3') || preg_match('/\bD3\b/', $n) === 1 => '**Appendix D3 — Jadual Pematuhan Spesifikasi Pelaksanaan Dan Sokongan**.',
        str_contains($n, 'APPENDIX D4') || preg_match('/\bD4\b/', $n) === 1 => '**Appendix D4 — Jadual Pelaksanaan**.',
        str_contains($n, 'APPENDIX D5') || preg_match('/\bD5\b/', $n) === 1 => '**Appendix D5 — Jadual Senarai Latihan, Taklimat & T.O.T**.',
        str_contains($n, 'APPENDIX D6') || preg_match('/\bD6\b/', $n) === 1 => '**Appendix D6 — Carta & Senarai Pasukan Projek**.',
        str_contains($n, 'APPENDIX D11') || preg_match('/\bD11\b/', $n) === 1 => '**Appendix D11 — Jadual Pematuhan Pembentangan Prototaip**.',
        str_contains($n, 'APPENDIX C1') || preg_match('/\bC1\b/', $n) === 1 => '**Appendix C1 — Jadual Pematuhan Keperluan Mandatori**.',
        str_contains($n, 'SRS LENGKAP') => '**SRS Lengkap v2 — Sistem Digital ST**. Primary software requirements specification.',
        str_contains($n, 'EXAMPLE OF SRS') => '**Example of SRS Format**. Reference template for SRS structure.',
        str_contains($n, 'KONTRAKTOR BARU') => '**Panduan Permohonan Pendaftaran Kontraktor Baru**. Existing-system guide (reference only — new UI should not copy this).',
        str_contains($n, 'ORANG KEMPETEN') || str_contains($n, 'ORANG KOMPETEN ELEKTRIK') => '**Panduan Permohonan Pendaftaran Orang Kompeten Elektrik**. Existing-system guide (reference only).',
        str_contains($n, 'PENDAFTARAN SEMULA') => '**Panduan Permohonan Pendaftaran Semula Orang Kompeten**. Existing-system renewal guide (reference only).',
        str_contains($n, 'BORANG') => '**Borang Pendaftaran Orang Kompeten**. Legacy application form fields (reference only — redesign for new system).',
        default => null,
    };
}

function buildStructuredMd(string $pdfName, array $pageTexts, string $relPdfPath, string $slug, string $originalRel): string
{
    $pageCount = count($pageTexts);
    $nonEmpty = count(array_filter($pageTexts, static fn ($t) => $t !== ''));
    $md = [];
    $md[] = '# ' . preg_replace('/\.pdf$/i', '', $pdfName);
    $md[] = '';
    $md[] = '| Field | Value |';
    $md[] = '|-------|-------|';
    $md[] = '| Source PDF | `' . $relPdfPath . '` |';
    $md[] = '| Original | `C:/ST/' . $originalRel . '` |';
    $md[] = '| Pages | ' . $pageCount . ' (' . $nonEmpty . ' with extractable text) |';
    $md[] = '| Full text | [`' . $slug . '-full-text.md`](./' . $slug . '-full-text.md) |';
    $md[] = '';
    $md[] = '> Machine-extracted for AI-assisted development. Scanned/image-only pages may be empty — refer to the original PDF for diagrams and tables.';
    $md[] = '';

    $about = aboutBlurb($pdfName);
    if ($about) {
        $md[] = '## About';
        $md[] = '';
        $md[] = $about;
        $md[] = '';
    }

    if ($nonEmpty === 0) {
        $md[] = '## Extraction note';
        $md[] = '';
        $md[] = '**No extractable text** was found (likely a scanned/image PDF). Keep the PDF as the source of truth.';
        $md[] = '';
        return implode("\n", $md);
    }

    $md[] = '## Extracted Content by Page';
    $md[] = '';

    for ($i = 1; $i <= $pageCount; $i++) {
        $text = $pageTexts[$i] ?? '';
        if ($text === '') {
            continue;
        }
        $md[] = "### Page {$i}";
        $md[] = '';
        $md[] = substr_count($text, '•') >= 2 ? formatBullets($text) : $text;
        $md[] = '';
    }

    return implode("\n", $md);
}

function buildFullTextMd(string $pdfName, array $pageTexts, string $relPdfPath): string
{
    $md = [];
    $md[] = '# ' . preg_replace('/\.pdf$/i', '', $pdfName) . ' — Full Text';
    $md[] = '';
    $md[] = '> Raw page-by-page extract from `' . $relPdfPath . '`.';
    $md[] = '';

    $any = false;
    foreach ($pageTexts as $num => $text) {
        if ($text === '') {
            continue;
        }
        $any = true;
        $md[] = "---\n";
        $md[] = "## Page {$num}\n";
        $md[] = $text . "\n";
    }

    if (!$any) {
        $md[] = '_No extractable text (scanned/image PDF)._';
        $md[] = '';
    }

    return implode("\n", $md);
}

$parser = new Smalot\PdfParser\Parser();
$results = [];
$pdfs = iterator_to_array(findPdfs($sourceRoot), false);
sort($pdfs, SORT_NATURAL | SORT_FLAG_CASE);

echo 'Found ' . count($pdfs) . " PDF(s) under {$sourceRoot} (excluding suhten-repo)\n\n";

foreach ($pdfs as $pdfPath) {
    $rel = relativeFrom($pdfPath, $sourceRoot); // e.g. Tender Docs/fromSharePoint/foo.pdf
    $relDir = str_replace('\\', '/', dirname($rel));
    if ($relDir === '.' || $relDir === '') {
        $outDir = $outputRoot . '/reference';
        $relOutPdf = 'docs/reference/' . basename($rel);
    } else {
        // Flatten SharePoint nesting: Tender Docs/fromSharePoint/X -> docs/Tender Docs/X
        $relDir = preg_replace('#^Tender Docs/fromSharePoint#i', 'Tender Docs', $relDir) ?? $relDir;
        $outDir = $outputRoot . '/' . $relDir;
        $relOutPdf = 'docs/' . $relDir . '/' . basename($rel);
    }

    $pdfName = basename($pdfPath);
    $slug = slugify($pdfName);

    echo "Converting: {$rel}\n";
    echo "  -> {$relOutPdf}\n";

    try {
        ensureDir($outDir);

        $destPdf = $outDir . '/' . $pdfName;
        if (!file_exists($destPdf) || filesize($destPdf) !== filesize($pdfPath)) {
            if (!copy($pdfPath, $destPdf)) {
                throw new RuntimeException("Failed to copy PDF to {$destPdf}");
            }
        }

        $pdf = $parser->parseFile($pdfPath);
        $pages = $pdf->getPages();
        $pageTexts = [];
        foreach ($pages as $i => $page) {
            $pageTexts[$i + 1] = cleanPageText($page->getText() ?? '');
        }

        $structuredPath = $outDir . '/' . $slug . '.md';
        $fullTextPath = $outDir . '/' . $slug . '-full-text.md';

        file_put_contents($structuredPath, buildStructuredMd($pdfName, $pageTexts, $relOutPdf, $slug, $rel));
        file_put_contents($fullTextPath, buildFullTextMd($pdfName, $pageTexts, $relOutPdf));

        $nonEmpty = count(array_filter($pageTexts, static fn ($t) => $t !== ''));
        $results[] = [
            'source' => $rel,
            'pdf' => $pdfName,
            'out_dir' => str_replace('\\', '/', substr($outDir, strlen($repoRoot) + 1)),
            'pages' => count($pages),
            'text_pages' => $nonEmpty,
            'structured' => basename($structuredPath),
            'full' => basename($fullTextPath),
        ];

        echo "  OK  {$nonEmpty}/" . count($pages) . " pages with text\n";

        unset($pdf, $pages, $pageTexts);
        gc_collect_cycles();
    } catch (Throwable $e) {
        $results[] = [
            'source' => $rel,
            'pdf' => $pdfName,
            'error' => $e->getMessage(),
        ];
        echo '  ERROR: ' . $e->getMessage() . "\n";
    }
}

// Index
$index = [];
$index[] = '# ST PDF Documents — Markdown Index';
$index[] = '';
$index[] = '> Auto-generated from all PDFs under `C:\\ST` (excluding `suhten-repo`).';
$index[] = '> Regenerated by: `php scripts/convert-st-pdfs.php`';
$index[] = '';
$index[] = '| Source (C:\\ST) | Pages | Text pages | Structured MD | Full Text | PDF copy |';
$index[] = '|----------------|-------|------------|---------------|-----------|----------|';

foreach ($results as $r) {
    if (isset($r['error'])) {
        $index[] = "| `{$r['source']}` | — | — | **FAILED:** {$r['error']} | — | — |";
        continue;
    }
    // out_dir is like "docs/reference" — strip leading "docs/" for links relative to PDF-INDEX.md
    $dir = preg_replace('#^docs/#', '', $r['out_dir']) ?? $r['out_dir'];
    $index[] = sprintf(
        '| `%s` | %d | %d | [`%s`](./%s) | [`%s`](./%s) | [`%s`](./%s) |',
        $r['source'],
        $r['pages'],
        $r['text_pages'],
        $r['structured'],
        $dir . '/' . $r['structured'],
        $r['full'],
        $dir . '/' . $r['full'],
        $r['pdf'],
        $dir . '/' . $r['pdf'],
    );
}

$index[] = '';
$index[] = '## Folder layout';
$index[] = '';
$index[] = '- `docs/reference/` — panduan & borang from `C:\\ST\\` root';
$index[] = '- `docs/SRS/` — SRS documents';
$index[] = '- `docs/Tender Docs/` — tender appendices (from SharePoint folder)';
$index[] = '';
$index[] = '## Usage';
$index[] = '';
$index[] = '- Prefer **structured** `.md` for navigation.';
$index[] = '- Use **`-full-text.md`** for exact search.';
$index[] = '- If **Text pages = 0**, the PDF is likely scanned — open the PDF copy.';
$index[] = '';

file_put_contents($outputRoot . '/PDF-INDEX.md', implode("\n", $index));

// Refresh Tender Docs README if that folder exists
$tenderDir = $outputRoot . '/Tender Docs';
if (is_dir($tenderDir)) {
    $tenderResults = array_values(array_filter($results, static fn ($r) => isset($r['out_dir']) && str_starts_with($r['out_dir'], 'docs/Tender Docs')));
    $tIdx = [];
    $tIdx[] = '# Tender Docs — Markdown Index';
    $tIdx[] = '';
    $tIdx[] = '> See also root index: [`../PDF-INDEX.md`](../PDF-INDEX.md)';
    $tIdx[] = '';
    $tIdx[] = '| PDF | Pages | Text pages | Structured | Full text |';
    $tIdx[] = '|-----|-------|------------|------------|-----------|';
    foreach ($tenderResults as $r) {
        if (isset($r['error'])) {
            $tIdx[] = "| `{$r['pdf']}` | — | — | **FAILED** | — |";
        } else {
            $tIdx[] = "| [`{$r['pdf']}`](./{$r['pdf']}) | {$r['pages']} | {$r['text_pages']} | [`{$r['structured']}`](./{$r['structured']}) | [`{$r['full']}`](./{$r['full']}) |";
        }
    }
    $tIdx[] = '';
    file_put_contents($tenderDir . '/README.md', implode("\n", $tIdx));
}

echo "\nDone. Index: docs/PDF-INDEX.md\n";
$ok = count(array_filter($results, static fn ($r) => !isset($r['error'])));
$fail = count($results) - $ok;
echo "Converted: {$ok} OK, {$fail} failed\n";
