# Supabase の個人アクセストークン (sbp_...) を暗号化して保存します。
# 保存先: C:\Users\<ユーザー名>\.secrets\supabase-access-token.dat
# Windows の DPAPI で暗号化されるため、このPCの「このWindowsユーザー」だけが復号できます。
# 実行方法: powershell -ExecutionPolicy Bypass -File scripts\save-supabase-token.ps1

$dir  = Join-Path $HOME '.secrets'
$file = Join-Path $dir 'supabase-access-token.dat'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$secure = Read-Host 'Supabase のアクセストークン (sbp_...) を貼り付けて Enter（画面には表示されません）' -AsSecureString
if ($secure.Length -eq 0) { Write-Host '入力が空のため中止しました'; exit 1 }

$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if (-not $plain.StartsWith('sbp_')) { Write-Host '注意: sbp_ で始まっていません。anon / service_role キーではないか確認してください' }
} finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr); $plain = $null }

$secure | ConvertFrom-SecureString | Set-Content -Path $file -Encoding ascii

# フォルダを自分だけがアクセスできるように制限
icacls $dir /inheritance:r /grant:r "$($env:USERNAME):(OI)(CI)F" | Out-Null

Write-Host "暗号化して保存しました: $file"
