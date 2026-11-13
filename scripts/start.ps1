# サイトをローカルで起動してブラウザで開く
# 実行方法: powershell -ExecutionPolicy Bypass -File scripts\start.ps1
$root = Split-Path $PSScriptRoot -Parent
Start-Process 'http://localhost:5173'
node (Join-Path $root 'scripts\serve.js')
