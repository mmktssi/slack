# =========================================================
#  研修サイトの利用者（アカウント）を管理する管理者用スクリプト
#  ※ .env の SUPABASE_SERVICE_ROLE_KEY（管理者キー）を使います。サイトには入れません。
#
#  使い方（PowerShell で Slack研修 フォルダを開いて実行）:
#    招待（アカウント作成）: powershell -ExecutionPolicy Bypass -File scripts\admin-users.ps1 add  山田@example.com
#    一覧                  : powershell -ExecutionPolicy Bypass -File scripts\admin-users.ps1 list
#    パスワード再発行      : powershell -ExecutionPolicy Bypass -File scripts\admin-users.ps1 reset 山田@example.com
#    削除                  : powershell -ExecutionPolicy Bypass -File scripts\admin-users.ps1 remove 山田@example.com
#
#  add / reset では「仮パスワード」が表示されます。本人に伝え、初回サインイン後に
#  サイドバー上部「会計事業部 ⌄」→「メールアドレス・パスワードを変更」で変えてもらってください。
# =========================================================
param([Parameter(Position = 0)][ValidateSet('add', 'list', 'reset', 'remove')][string]$Command = 'list',
      [Parameter(Position = 1)][string]$Email)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8

# .env を読む
$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
$cfg = @{}
foreach ($l in [IO.File]::ReadAllLines($envFile, [Text.Encoding]::UTF8)) { if ($l -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $cfg[$matches[1]] = $matches[2].Trim() } }
if (-not $cfg.SUPABASE_URL -or -not $cfg.SUPABASE_SERVICE_ROLE_KEY) { throw '.env に SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください' }
$base = $cfg.SUPABASE_URL.TrimEnd('/') + '/auth/v1/admin'
$headers = @{ apikey = $cfg.SUPABASE_SERVICE_ROLE_KEY; Authorization = 'Bearer ' + $cfg.SUPABASE_SERVICE_ROLE_KEY }

function Api($Method, $Path, $Body = $null) {
  $p = @{ Method = $Method; Uri = "$base$Path"; Headers = $headers; ContentType = 'application/json; charset=utf-8' }
  if ($null -ne $Body) { $p.Body = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 5 -Compress)) }
  Invoke-RestMethod @p
}
function New-TempPassword {
  # 紛らわしい文字（0/O, 1/l/I）を除いた 12 文字
  $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'.ToCharArray()
  $rng = [Security.Cryptography.RandomNumberGenerator]::Create(); $bytes = New-Object byte[] 12; $rng.GetBytes($bytes)
  -join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })
}
function Find-User($mail) {
  $page = 1
  while ($true) {
    $r = Api GET "/users?page=$page&per_page=200"
    $hit = $r.users | Where-Object { $_.email -eq $mail.ToLower() } | Select-Object -First 1
    if ($hit) { return $hit }
    if ($r.users.Count -lt 200) { return $null }
    $page++
  }
}
function Need-Email { if (-not $Email) { throw 'メールアドレスを指定してください（例: ... add 山田@example.com）' } }

switch ($Command) {
  'list' {
    $r = Api GET '/users?per_page=200'
    if (-not $r.users.Count) { Write-Host 'まだ利用者はいません。'; break }
    $r.users | Sort-Object created_at | ForEach-Object {
      $last = if ($_.last_sign_in_at) { ([datetime]$_.last_sign_in_at).ToLocalTime().ToString('yyyy/MM/dd HH:mm') } else { '未サインイン' }
      '{0,-40} 作成 {1}  最終サインイン {2}' -f $_.email, ([datetime]$_.created_at).ToLocalTime().ToString('yyyy/MM/dd'), $last
    }
  }
  'add' {
    Need-Email
    if (Find-User $Email) { throw "$Email は既に登録されています（パスワード再発行は reset を使ってください）" }
    $pw = New-TempPassword
    Api POST '/users' @{ email = $Email; password = $pw; email_confirm = $true; user_metadata = @{ must_change_password = $true } } | Out-Null
    Write-Host "アカウントを作成しました。"
    Write-Host "  メールアドレス : $Email"
    Write-Host "  仮パスワード   : $pw"
    Write-Host 'この仮パスワードを本人に伝えてください（初回サインイン後に変更してもらいます）。'
  }
  'reset' {
    Need-Email
    $u = Find-User $Email; if (-not $u) { throw "$Email は見つかりません" }
    $pw = New-TempPassword
    Api PUT "/users/$($u.id)" @{ password = $pw; user_metadata = @{ must_change_password = $true } } | Out-Null
    Write-Host "パスワードを再発行しました。"
    Write-Host "  メールアドレス : $Email"
    Write-Host "  仮パスワード   : $pw"
  }
  'remove' {
    Need-Email
    $u = Find-User $Email; if (-not $u) { throw "$Email は見つかりません" }
    $ans = Read-Host "$Email のアカウントとデータを完全に削除します。よろしければ yes と入力"
    if ($ans -ne 'yes') { Write-Host '中止しました。'; break }
    Api DELETE "/users/$($u.id)" | Out-Null
    Write-Host "$Email を削除しました。"
  }
}
