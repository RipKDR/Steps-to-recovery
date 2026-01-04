#!/bin/bash
# Fix import paths in hook files

files=(
  "apps/mobile/src/components/home/PhoneWidget.tsx"
  "apps/mobile/src/hooks/useAuth.ts"
  "apps/mobile/src/hooks/useCheckin.ts"
  "apps/mobile/src/hooks/useContacts.ts"
  "apps/mobile/src/hooks/useJitai.ts"
  "apps/mobile/src/hooks/useJournal.ts"
  "apps/mobile/src/hooks/useMeetings.ts"
  "apps/mobile/src/hooks/useNotifications.ts"
  "apps/mobile/src/hooks/usePhoneCalls.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Fix store imports
    sed -i "s|from ['\"]\.\.\/store['\"]|from '@recovery/shared'|g" "$file"
    sed -i "s|from ['\"]\.\.\/store\/|from '@recovery/shared/store/|g" "$file"
    
    # Fix types imports
    sed -i "s|from ['\"]\.\.\/types['\"]|from '@recovery/shared'|g" "$file"
    
    # Fix JITAI imports  
    sed -i "s|from ['\"]\.\.\/jitai\/engine['\"]|from '@recovery/shared/jitai/engine'|g" "$file"
    sed -i "s|from ['\"]\.\.\/jitai\/types['\"]|from '@recovery/shared/jitai/types'|g" "$file"
    
    # Fix notifications imports
    sed -i "s|from ['\"]\.\.\/notifications['\"]|from '@recovery/shared/notifications'|g" "$file"
    
    echo "Fixed: $file"
  fi
done

# Also fix the types import in PhoneWidget  
sed -i "s|from ['\"]\.\.\/.\.\/types['\"]|from '@recovery/shared'|g" "apps/mobile/src/components/home/PhoneWidget.tsx"

echo "All import paths fixed!"
