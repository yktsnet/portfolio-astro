#!/usr/bin/env bash
# PreToolUse(Bash): astro dev を起動するコマンドの前に dev-preflight.sh を当て、通らなければ止める
set -u

input=$(cat)
cmd=$(jq -r '.tool_input.command // ""' <<<"$input")
cwd=$(jq -r '.cwd // ""' <<<"$input")

# 起動だけを対象にし、stop / status / logs は通す
if ! grep -qE '(npx astro dev|npm run dev)([[:space:]"]|$)' <<<"$cmd" || grep -qE 'astro dev (stop|status|logs)' <<<"$cmd" \
  || grep -qE '^[[:space:]]*(grep|rg|sed|cat|echo|git) ' <<<"$cmd"; then
  exit 0
fi

# 起動先は tmux の -c、先頭の cd、hook の cwd の順に取る
dir=$(grep -oE -- 'split-window[^;&|]* -c "?[^" ]+' <<<"$cmd" | head -1 | sed -E 's/.* -c "?//')
[[ -z "$dir" ]] && dir=$(grep -oE '^cd "?[^" &;]+' <<<"$cmd" | head -1 | sed -E 's/^cd "?//')
[[ -z "$dir" ]] && dir=$cwd
[[ "$dir" != /* ]] && dir="$cwd/$dir"

opt=""
grep -q 'CF_REMOTE_BINDINGS=false' <<<"$cmd" && opt="--no-remote"

script="$(dirname "$0")/../scripts/dev-preflight.sh"
if ! msg=$(bash "$script" "$dir" $opt 2>&1); then
  echo "$msg" >&2
  exit 2
fi
exit 0
