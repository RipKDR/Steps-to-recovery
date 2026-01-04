#!/bin/bash
# Fix broken imports caused by previous sed script

echo "Fixing broken import statements..."

find apps/mobile/src/components -type f \( -name "*.tsx" -o -name "*.ts" \) | while read -r file; do
  # Fix patterns like: from '@recovery/shared'keytags' -> from '@recovery/shared'
  sed -i "s|from '@recovery/shared'[a-zA-Z/]*'|from '@recovery/shared'|g" "$file"

  # Fix patterns like: from '@recovery/shared'literatureStore' -> from '@recovery/shared'
  sed -i "s|from '@recovery/shared'[a-zA-Z]*'|from '@recovery/shared'|g" "$file"
done

echo "Done fixing broken imports!"
