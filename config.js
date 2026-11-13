// Supabase の接続設定（公開して問題ない値だけを置く）
// publishable キーはブラウザで使う前提の公開用キーです。データはデータベース側の RLS で本人のものだけに制限されています。
// ※ service_role / secret キーやアクセストークンは絶対にここへ書かないこと。
window.SUPABASE_CONFIG = {
  url: 'https://msjbjxkisqzsuwggmzhw.supabase.co',
  key: 'sb_publishable_7WLrNqqfMRb2RqDWMtr9ww_fPCNMahL',
};