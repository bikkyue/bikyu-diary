#!/bin/bash
set -e

node scripts/update-diary-meta.cli.mjs

git add src/content/diaries/ src/content/diaries.json

if git diff --staged --quiet; then
  echo "変更なし"
  exit 0
fi

DIARIES_PREFIX="src/content/diaries/"

MSG=""
while IFS=$'\t' read -r status old new; do
  case "$status" in
    A)
      rel="${old#$DIARIES_PREFIX}"
      MSG="${MSG}add diary: ${rel}"$'\n'
      ;;
    D)
      rel="${old#$DIARIES_PREFIX}"
      MSG="${MSG}delete diary: ${rel}"$'\n'
      ;;
    M)
      rel="${old#$DIARIES_PREFIX}"
      MSG="${MSG}update diary: ${rel}"$'\n'
      ;;
    R*)
      old_rel="${old#$DIARIES_PREFIX}"
      new_rel="${new#$DIARIES_PREFIX}"
      MSG="${MSG}move diary: ${old_rel} → ${new_rel}"$'\n'
      ;;
  esac
done < <(git -c core.quotepath=false diff --staged --name-status | grep "$DIARIES_PREFIX.*\.md")

MSG="${MSG%$'\n'}"

if [ -z "$MSG" ]; then
  MSG="update diary"
fi

git commit -m "$MSG"
git push
