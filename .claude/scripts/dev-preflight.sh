#!/usr/bin/env bash
# astro dev を起動する前の確認。止める理由があれば stderr に書いて 1 で終わる。
# 使い方: dev-preflight.sh <起動するディレクトリ> [--no-remote]
set -u

dir=${1:-.}
no_remote=${2:-}
errors=()

if [[ ! -f "$dir/package.json" ]]; then
  echo "dev-preflight: $dir has no package.json" >&2
  exit 1
fi

# Vite は起動したディレクトリの外のファイルを配らない。node_modules を元のチェックアウトへの
# シンボリックリンクにすると、@fontsource の Fira Code が読めずに別の字形で表示される
if [[ -L "$dir/node_modules" ]]; then
  errors+=("node_modules is a symlink. Fonts under it are blocked by Vite. Run: rm $dir/node_modules && (cd $dir && npm ci)")
elif [[ ! -d "$dir/node_modules" ]]; then
  errors+=("node_modules is missing. Run: (cd $dir && npm ci)")
fi

# astro.config.mjs は既定で remote バインディング（KV の SESSION）につなぎに行き、
# Cloudflare の認証が無いと起動に失敗する
if [[ "$no_remote" != "--no-remote" && -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  cfg="${XDG_CONFIG_HOME:-$HOME/.config}/.wrangler/config/default.toml"
  if ! grep -q '^refresh_token' "$cfg" 2>/dev/null; then
    errors+=("Cloudflare login is missing. Ask the user to run: ! npx wrangler login  (or start with CF_REMOTE_BINDINGS=false to view pages only; /api/* will not work)")
  fi
fi

if (( ${#errors[@]} > 0 )); then
  printf 'dev-preflight: %s\n' "${errors[@]}" >&2
  exit 1
fi
exit 0
