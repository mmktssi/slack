# 暗号化して保存したアクセストークンで Supabase Management API を呼び出す共通処理
# 使い方（他のスクリプトから）: . "$PSScriptRoot\supabase-api.ps1"; Invoke-SupabaseApi GET "/v1/projects"
$ErrorActionPreference = 'Stop'
$script:SupabaseRef = 'msjbjxkisqzsuwggmzhw'

function Invoke-SupabaseApi([string]$Method, [string]$Path, $Body = $null) {
  $file = Join-Path $HOME '.secrets\supabase-access-token.dat'
  if (-not (Test-Path $file)) { throw '先に scripts\save-supabase-token.ps1 を実行してトークンを保存してください' }
  $secure = Get-Content $file | ConvertTo-SecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $headers = @{ Authorization = 'Bearer ' + [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
    $params = @{ Method = $Method; Uri = "https://api.supabase.com$Path"; Headers = $headers; ContentType = 'application/json; charset=utf-8' }
    if ($null -ne $Body) { $params.Body = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 10 -Compress)) }
    Invoke-RestMethod @params
  } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}
