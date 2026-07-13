<?php

/**
 * Batch-convert PDFs in docs/Tender Docs/ to Markdown.
 * Usage: php scripts/convert-tender-pdfs.php
 */

ini_set('memory_limit', '1024M');

$repoRoot = dirname(__DIR__);
$inputDir = $repoRoot . '/docs/Tender Docs';
$outputDir = $inputDir; // write .md alongside PDFs
$autoload = 'C:/Users/masri/AppData/Local/Temp/pdf-php/vendor/autoload.php';

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
    return trim($name, '-');
}

function cleanPageText(string $text): string
{
    $text = preg_replace('/D03[^\n]*Muka surat[^\n]*/i', '', $text);
    $text = str_replace(["\x{FFFC}", '￼'], '', $text);
    $text = preg_replace('/[ \t]+/', ' ', $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    return trim($text);
}

function formatBullets(string $text): string
{
    return trim(preg_replace('/\s*•\s*/', "\n- ", $text));
}

function detectSections(string $text): array
{
    $sections = [];
    // Match numbered headings like "1. TITLE" or "1.1 Subtitle" or "APPENDIX G"
    if (preg_match_all('/(?:^|\s)(\d+(?:\.\d+)*)\s+([A-ZÁÉÍÓÚÄËÏÖÜÂÊÎÔÛÀÈÌÒÙÇÑ][^\n]{2,80})/u', $text, $m, PREG_SET_ORDER)) {
        foreach ($m as $match) {
            $sections[] = ['num' => $match[1], 'title' => trim($match[2])];
        }
    }
    return $sections;
}

function buildStructuredMd(string $pdfName, array $pageTexts, string $relPdfPath): string
{
    $slug = slugify($pdfName);
    $pageCount = count($pageTexts);
    $allText = implode("\n\n", $pageTexts);

    $md = [];
    $md[] = '# ' . preg_replace('/\.pdf$/i', '', $pdfName);
    $md[] = '';
    $md[] = '| Field | Value |';
    $md[] = '|-------|-------|';
    $md[] = '| Source PDF | `' . $relPdfPath . '` |';
    $md[] = '| Pages | ' . $pageCount . ' |';
    $md[] = '| Full text | [`' . $slug . '-full-text.md`](./' . $slug . '-full-text.md) |';
    $md[] = '';
    $md[] = '> Machine-extracted from tender PDF for AI-assisted development. Diagrams/tables may be incomplete — refer to original PDF when needed.';
    $md[] = '';

    // Auto-detect appendix type from filename
    if (stripos($pdfName, 'APPENDIX G') !== false) {
        $md[] = '## About';
        $md[] = '';
        $md[] = '**Appendix G — Keterangan Modul (Module Descriptions)**. Detailed module descriptions referenced by the SRS.';
        $md[] = '';
    } elseif (stripos($pdfName, 'APPENDIX H') !== false) {
        $md[] = '## About';
        $md[] = '';
        $md[] = '**Appendix H — List of Integration**. External system integration specifications.';
        $md[] = '';
    } elseif (stripos($pdfName, 'APPENDIX D1') !== false || stripos($pdfName, 'D1') !== false) {
        $md[] = '## About';
        $md[] = '';
        $md[] = '**Appendix D1 — Jadual Pematuhan Spesifikasi Fungsi (Functional Specification Compliance Schedule)**. Mandatory functional requirements checklist referenced by the SRS.';
        $md[] = '';
    } elseif (stripos($pdfName, 'APPENDIX D2') !== false || stripos($pdfName, 'D2') !== false) {
        $md[] = '## About';
        $md[] = '';
        $md[] = '**Appendix D2 — Jadual Pematuhan Spesifikasi Teknikal (Technical Specification Compliance Schedule)**.';
        $md[] = '';
    } elseif (stripos($pdfName, 'APPENDIX I') !== false) {
        $md[] = '## About';
        $md[] = '';
        $md[] = '**Appendix I — Akronim (Acronyms)**. Glossary of acronyms used across tender documents.';
        $md[] = '';
    }

    $md[] = '## Table of Contents';
    $md[] = '';
    $md[] = '- [Extracted Content by Page](#extracted-content-by-page)';
    $md[] = '';

    // Try to build page-level TOC for larger docs
    if ($pageCount > 5) {
        $md[] = '### Pages';
        $md[] = '';
        for ($i = 1; $i <= $pageCount; $i++) {
            if (!empty($pageTexts[$i])) {
                $preview = mb_substr(preg_replace('/\s+/', ' ', $pageTexts[$i]), 0, 60);
                $md[] = "- [Page {$i}](#page-{$i}) — {$preview}…";
            }
        }
        $md[] = '';
    }

    $md[] = '---';
    $md[] = '';
    $md[] = '## Extracted Content by Page';
    $md[] = '';

    for ($i = 1; $i <= $pageCount; $i++) {
        $text = $pageTexts[$i] ?? '';
        if ($text === '') {
            continue;
        }
        $md[] = "### Page {$i}";
        $md[] = '';
        // Format bullet points
        if (substr_count($text, '•') >= 2) {
            $md[] = formatBullets($text);
        } else {
            $md[] = $text;
        }
        $md[] = '';
    }

    return implode("\n", $md);
}

function buildFullTextMd(string $pdfName, array $pageTexts, string $relPdfPath): string
{
    $md = [];
    $md[] = '# ' . preg_replace('/\.pdf$/i', '', $pdfName) . ' — Full Text';
    $md[] = '';
    $md[] = '> Raw page-by-page extract from `' . $relPdfPath . '`. See structured version without `-full-text` suffix.';
    $md[] = '';

    foreach ($pageTexts as $num => $text) {
        if ($text === '') {
            continue;
        }
        $md[] = "---\n";
        $md[] = "## Page {$num}\n";
        $md[] = $text . "\n";
    }

    return implode("\n", $md);
}

$parser = new Smalot\PdfParser\Parser();
$pdfs = glob($inputDir . '/*.pdf');

if (!$pdfs) {
    fwrite(STDERR, "No PDF files found in {$inputDir}\n");
    exit(1);
}

sort($pdfs, SORT_NATURAL | SORT_FLAG_CASE);
$results = [];

foreach ($pdfs as $pdfPath) {
    $pdfName = basename($pdfPath);
    $slug = slugify($pdfName);
    $relPdfPath = 'docs/Tender Docs/' . $pdfName;

    echo "Converting: {$pdfName}...\n";

    try {
        $pdf = $parser->parseFile($pdfPath);
        $pages = $pdf->getPages();
        $pageTexts = [];

        foreach ($pages as $i => $page) {
            $pageTexts[$i + 1] = cleanPageText($page->getText() ?? '');
        }

        $structuredPath = $outputDir . '/' . $slug . '.md';
        $fullTextPath = $outputDir . '/' . $slug . '-full-text.md';

        file_put_contents($structuredPath, buildStructuredMd($pdfName, $pageTexts, $relPdfPath));
        file_put_contents($fullTextPath, buildFullTextMd($pdfName, $pageTexts, $relPdfPath));

        $results[] = [
            'pdf' => $pdfName,
            'pages' => count($pages),
            'structured' => basename($structuredPath),
            'full' => basename($fullTextPath),
            'structured_bytes' => filesize($structuredPath),
            'full_bytes' => filesize($fullTextPath),
        ];

        // Free memory between files
        unset($pdf, $pages, $pageTexts);
        gc_collect_cycles();
    } catch (Throwable $e) {
        $results[] = [
            'pdf' => $pdfName,
            'error' => $e->getMessage(),
        ];
        echo "  ERROR: {$e->getMessage()}\n";
    }
}

// Write index file
$index = [];
$index[] = '# Tender Docs — Markdown Index';
$index[] = '';
$index[] = '> Auto-generated index of converted tender appendix documents.';
$index[] = '';
$index[] = '| PDF | Pages | Structured MD | Full Text MD |';
$index[] = '|-----|-------|---------------|--------------|';

foreach ($results as $r) {
    if (isset($r['error'])) {
        $index[] = "| `{$r['pdf']}` | — | **FAILED:** {$r['error']} | — |";
    } else {
        $index[] = "| [`{$r['pdf']}`](./{$r['pdf']}) | {$r['pages']} | [`{$r['structured']}`](./{$r['structured']}) | [`{$r['full']}`](./{$r['full']}) |";
    }
}

$index[] = '';
$index[] = '## Usage';
$index[] = '';
$index[] = '- Use the **structured** `.md` files for navigation and development reference.';
$index[] = '- Use the **`-full-text.md`** files for exact text search across all pages.';
$index[] = '- Original PDFs remain the authoritative source for diagrams and formatted tables.';
$index[] = '';

file_put_contents($outputDir . '/README.md', implode("\n", $index));

echo "\nDone. Index: docs/Tender Docs/README.md\n";
foreach ($results as $r) {
    if (isset($r['error'])) {
        echo "  FAIL  {$r['pdf']}: {$r['error']}\n";
    } else {
        echo "  OK    {$r['pdf']} ({$r['pages']} pages) -> {$r['structured']}\n";
    }
}
