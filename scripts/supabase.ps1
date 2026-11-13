# 暗号化して保存したアクセストークンを読み込み、Supabase CLI を実行します。
# トークンはこのコマンドの実行中だけ使われ、終わると消えます。
# 実行例: powershell -ExecutionPolicy Bypass -File scripts\supabase.ps1 projects list

$file = Join-Path $HOME '.secrets\supabase-access-token.dat'
if (-not (Test-Path $file)) { Write-Host '先に scripts\save-supabase-token.ps1 を実行してトークンを保存してください'; exit 1 }

$secure = Get-Content $file | ConvertTo-SecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $env:SUPABASE_ACCESS_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  npx supabase @args
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  Remove-Item Env:SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue
}
