<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pertanyaan permohonan</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1f36;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e3e8ee;border-radius:8px;">
                <tr>
                    <td style="padding:28px 28px 8px;">
                        <p style="margin:0 0 8px;font-size:13px;color:#697386;text-transform:uppercase;letter-spacing:0.04em;">Sistem Digital ST</p>
                        <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">Pertanyaan daripada pegawai</h1>
                        <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#3c4257;">
                            Permohonan anda memerlukan kemaskini. Sila semak catatan pegawai di bawah, kemudian kemaskini permohonan dan muat naik dokumen yang diminta.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 28px 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fc;border:1px solid #e3e8ee;border-radius:6px;">
                            <tr>
                                <td style="padding:16px 18px;font-size:14px;line-height:1.6;">
                                    <div><strong>No. rujukan:</strong> {{ $refNo }}</div>
                                    <div><strong>Pemohon:</strong> {{ $applicantName }}</div>
                                    <div><strong>Modul:</strong> {{ $moduleCode }}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 28px 20px;">
                        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#697386;text-transform:uppercase;letter-spacing:0.04em;">Catatan pegawai</p>
                        <div style="background:#fff8e6;border:1px solid #f5d78e;border-radius:6px;padding:14px 16px;font-size:14px;line-height:1.6;color:#3c4257;white-space:pre-wrap;">{{ $note }}</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:0 28px 28px;" align="center">
                        <a href="{{ $actionUrl }}"
                           style="display:inline-block;background:#0f4c81;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:6px;">
                            Kemaskini permohonan
                        </a>
                        <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#697386;word-break:break-all;">
                            Atau salin pautan selamat ini:<br>
                            <a href="{{ $actionUrl }}" style="color:#0f4c81;">{{ $actionUrl }}</a>
                        </p>
                        <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#697386;">
                            Jika anda belum log masuk, anda akan diminta log masuk dahulu. Selepas log masuk, halaman permohonan akan dibuka secara automatik.
                        </p>
                        @if ($intendedEmail)
                            <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#3c4257;background:#fff8e6;border:1px solid #f5d78e;border-radius:6px;padding:10px 12px;text-align:left;">
                                <strong>Penting (simulasi):</strong> e-mel pemohon yang dimaksudkan ialah
                                <code>{{ $intendedEmail }}</code>
                                — mesej ini dihantar ke alamat simulasi untuk ujian.
                            </p>
                        @endif
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
