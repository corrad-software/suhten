<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use Smalot\PdfParser\Parser as PdfParser;

class ChatAttachmentService
{
    private const IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

    private const DOC_MIMES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    public function isSupported(UploadedFile $file): bool
    {
        $mime = $file->getMimeType();

        return in_array($mime, self::IMAGE_MIMES, true) || in_array($mime, self::DOC_MIMES, true);
    }

    public function isImage(UploadedFile $file): bool
    {
        return in_array($file->getMimeType(), self::IMAGE_MIMES, true);
    }

    /**
     * Extract text from PDF, DOCX, or Excel. Returns null on failure.
     */
    public function extractTextFromDocument(UploadedFile $file): ?string
    {
        $path = $file->getRealPath();
        $ext = strtolower($file->getClientOriginalExtension());

        try {
            if ($ext === 'pdf') {
                $parser = new PdfParser;
                $pdf = $parser->parseFile($path);

                return $pdf->getText();
            }

            if (in_array($ext, ['docx', 'doc'])) {
                $phpWord = WordIOFactory::load($path);
                $text = '';
                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        $text .= $this->extractPhpWordElementText($element);
                    }
                }

                return trim($text);
            }

            if (in_array($ext, ['xlsx', 'xls'])) {
                $spreadsheet = IOFactory::load($path);
                $text = '';
                foreach ($spreadsheet->getAllSheets() as $sheet) {
                    $text .= $sheet->getTitle()."\n";
                    foreach ($sheet->toArray() as $row) {
                        $text .= implode("\t", array_map('strval', $row))."\n";
                    }
                    $text .= "\n";
                }

                return trim($text);
            }
        } catch (\Throwable $e) {
            Log::warning('ChatAttachmentService extractText failed', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
            ]);

            return null;
        }

        return null;
    }

    /**
     * Resize image if too large (max 1024px) and save as JPEG.
     */
    private function prepareImageForUpload(UploadedFile $file): string
    {
        $path = $file->getRealPath();
        $mime = $file->getMimeType();
        $maxDim = 1024;

        $img = match (true) {
            $mime === 'image/png' => @imagecreatefrompng($path),
            in_array($mime, ['image/jpeg', 'image/jpg']) => @imagecreatefromjpeg($path),
            $mime === 'image/webp' => @imagecreatefromwebp($path),
            $mime === 'image/gif' => @imagecreatefromgif($path),
            default => null,
        };

        if (! $img) {
            return $path;
        }

        $w = imagesx($img);
        $h = imagesy($img);
        if ($w <= $maxDim && $h <= $maxDim) {
            imagedestroy($img);

            return $path;
        }

        $ratio = min($maxDim / $w, $maxDim / $h);
        $nw = (int) round($w * $ratio);
        $nh = (int) round($h * $ratio);

        $resized = imagecreatetruecolor($nw, $nh);
        if (! $resized) {
            imagedestroy($img);

            return $path;
        }

        imagecopyresampled($resized, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
        imagedestroy($img);

        $tmp = sys_get_temp_dir().'/aina_chat_'.uniqid().'.jpg';
        imagejpeg($resized, $tmp, 75);
        imagedestroy($resized);

        return $tmp;
    }

    /**
     * Get image as base64 data URL for Anthropic vision.
     */
    public function getImageAsBase64(UploadedFile $file): ?string
    {
        $path = $this->prepareImageForUpload($file);
        $data = @file_get_contents($path);
        if ($path !== $file->getRealPath()) {
            @unlink($path);
        }
        if ($data === false) {
            return null;
        }

        return 'data:image/jpeg;base64,'.base64_encode($data);
    }

    public function getSupportedMimeTypes(): array
    {
        return array_merge(self::IMAGE_MIMES, self::DOC_MIMES);
    }

    public function getAcceptedExtensions(): string
    {
        return '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.gif';
    }

    private function extractPhpWordElementText(mixed $element): string
    {
        $text = '';
        if (method_exists($element, 'getText')) {
            $value = $element->getText();
            if (is_string($value)) {
                $text .= $value."\n";
            } elseif (is_object($value) && method_exists($value, 'getText')) {
                $nested = $value->getText();
                if (is_string($nested)) {
                    $text .= $nested."\n";
                }
            }
        }
        if (method_exists($element, 'getElements')) {
            foreach ($element->getElements() as $child) {
                $text .= $this->extractPhpWordElementText($child);
            }
        }

        return $text;
    }
}
