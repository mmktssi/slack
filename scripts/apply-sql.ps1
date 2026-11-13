# supabase フォルダの SQL ファイルを本番データベースに適用します（管理者用）
# 実行例: powershell -ExecutionPolicy Bypass -File scripts\apply-sql.ps1 supabase\shared.sql
param([Parameter(Mandatory = $true)][string]$SqlFile)
. "$PSScriptRoot\supabase-api.ps1"
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$sql = [IO.File]::ReadAllText((Resolve-Path $SqlFile), [Text.Encoding]::UTF8)
Invoke-SupabaseApi POST "/v1/projects/$SupabaseRef/database/query" @{ query = $sql } | Out-Null
Write-Host "適用しました: $SqlFile"
$rows = Invoke-SupabaseApi POST "/v1/projects/$SupabaseRef/database/query" @{ query = "select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1" }
$rows | ForEach-Object { Write-Host ("  {0,-16} RLS={1}" -f $_.tablename, $_.rowsecurity) }
