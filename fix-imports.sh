#!/bin/bash
# Fix incorrect import paths in component files

echo "Fixing import paths in component files..."

# Find all .tsx and .ts files in components directory
find apps/mobile/src/components -type f \( -name "*.tsx" -o -name "*.ts" \) | while read -r file; do
  echo "Processing: $file"

  # Fix store imports: ../../lib/store -> @recovery/shared
  sed -i "s|from ['\"]\.\./\.\./lib/store['\"]|from '@recovery/shared'|g" "$file"
  sed -i "s|from ['\"]\.\./\.\./lib/store/|from '@recovery/shared'|g" "$file"

  # Fix constants imports: ../../lib/constants/* -> @recovery/shared
  sed -i "s|from ['\"]\.\./\.\./lib/constants/|from '@recovery/shared'|g" "$file"

  # Fix types imports: ../../lib/types -> @recovery/shared
  sed -i "s|from ['\"]\.\./\.\./lib/types['\"]|from '@recovery/shared'|g" "$file"

  # Fix encryption imports: ../../lib/encryption -> ../../utils/encryption
  sed -i "s|from ['\"]\.\./\.\./lib/encryption['\"]|from '../../utils/encryption'|g" "$file"

  # Fix hooks imports: ../../lib/hooks/* -> ../../hooks/*
  sed -i "s|from ['\"]\.\./\.\./lib/hooks/|from '../../hooks/|g" "$file"

  # Fix utils imports: ../../lib/utils/* -> @recovery/shared or ../../utils/*
  sed -i "s|from ['\"]\.\./\.\./lib/utils/sms['\"]|from '@recovery/shared'|g" "$file"
done

echo "Done fixing imports!"
