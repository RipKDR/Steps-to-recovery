# Phase 3 Quick Reference Guide

## New Components Available

### Text Component (NEW) ✅

```tsx
import { Text } from '@/design-system';

// Variants
<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="h3">Heading 3</Text>
<Text variant="body">Body text</Text>
<Text variant="bodyLarge">Large body</Text>
<Text variant="caption">Caption</Text>
<Text variant="label">Label</Text>

// Colors
<Text color="text">Primary text</Text>
<Text color="textSecondary">Secondary</Text>
<Text color="primary">Primary color</Text>
<Text color="success">Success</Text>
<Text color="warning">Warning</Text>
<Text color="danger">Danger</Text>

// Weight
<Text weight="normal">Normal</Text>
<Text weight="medium">Medium</Text>
<Text weight="semibold">Semibold</Text>
<Text weight="bold">Bold</Text>

// Alignment
<Text align="left">Left</Text>
<Text align="center">Center</Text>
<Text align="right">Right</Text>

// Combined
<Text variant="h2" color="primary" weight="semibold" align="center">
  Step 1: Admission
</Text>
```

---

## Common Patterns from Phase 3

### 1. Screen Entrance Animation

```tsx
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// In component
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(30)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }),
  ]).start();
}, [fadeAnim, slideAnim]);

// In JSX
<Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
  {/* Your content */}
</Animated.View>
```

---

### 2. Toast Notifications

```tsx
import { Toast } from '@/design-system';

// State
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState('');
const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info' | 'warning'>('success');

// Usage
setToastMessage('Entry saved successfully');
setToastVariant('success');
setShowToast(true);

// JSX
<Toast
  visible={showToast}
  message={toastMessage}
  variant={toastVariant}
  onDismiss={() => setShowToast(false)}
/>
```

---

### 3. Haptic Feedback (Mobile Only)

```tsx
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// On success
if (Platform.OS !== 'web') {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

// On error
if (Platform.OS !== 'web') {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

// On warning
if (Platform.OS !== 'web') {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
```

---

### 4. Save with Feedback Pattern

```tsx
const handleSave = async () => {
  try {
    await saveData();

    // Success feedback
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setToastMessage('Saved successfully');
    setToastVariant('success');
    setShowToast(true);

    // Delayed navigation to show Toast
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  } catch (err) {
    setToastMessage('Failed to save. Please try again.');
    setToastVariant('error');
    setShowToast(true);
  }
};
```

---

### 5. Empty State

```tsx
import { EmptyState } from '@/design-system';
import { MaterialIcons } from '@expo/vector-icons';

<EmptyState
  icon={<MaterialIcons name="book" size={64} color={theme.colors.textSecondary} />}
  title="Your thoughts are safe here"
  description="Start your first journal entry to track your thoughts, feelings, and progress."
  actionLabel="Create Entry"
  onAction={handleCreateEntry}
/>
```

---

### 6. TextArea with Character Counter

```tsx
import { TextArea } from '@/design-system';

<TextArea
  label="Write your thoughts..."
  value={body}
  onChangeText={setBody}
  placeholder="Share your thoughts, feelings, and progress..."
  minHeight={200}
  maxLength={5000}
  showCharacterCount
/>
```

---

### 7. Search Input with Icon

```tsx
import { Input } from '@/design-system';
import { MaterialIcons } from '@expo/vector-icons';

<Input
  label=""
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search entries..."
  leftIcon={<MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />}
/>
```

---

### 8. Completion Indicator

```tsx
const isCompleted = /* check completion */;

<View
  style={[
    styles.indicator,
    isCompleted
      ? { backgroundColor: theme.colors.success }
      : { backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.border },
  ]}
>
  {isCompleted ? (
    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
  ) : (
    <Text variant="body" color="textSecondary" weight="semibold">
      {number}
    </Text>
  )}
</View>
```

---

### 9. Warning Card (High Craving)

```tsx
{craving >= 7 && (
  <Card variant="outlined" style={{ borderColor: theme.colors.danger }}>
    <View style={styles.warningContent}>
      <MaterialIcons name="warning" size={20} color={theme.colors.danger} />
      <Text variant="caption" color="danger" style={{ marginLeft: 8, flex: 1 }}>
        High craving detected. Consider reaching out to your sponsor.
      </Text>
    </View>
  </Card>
)}
```

---

### 10. Info Card (Encryption Indicator)

```tsx
<Card variant="elevated" style={styles.headerCard}>
  <View style={styles.headerContent}>
    <MaterialIcons name="lock" size={20} color={theme.colors.success} />
    <Text variant="caption" color="textSecondary" style={{ marginLeft: 8 }}>
      Your entry is encrypted and private
    </Text>
  </View>
</Card>
```

---

### 11. Dynamic Color Based on Value

```tsx
// Helper function
const getCravingColor = (craving: number, theme: Theme): string => {
  if (craving <= 2) return theme.colors.success;
  if (craving <= 4) return theme.colors.successMuted;
  if (craving <= 6) return theme.colors.warning;
  return theme.colors.danger;
};

// Usage
<View style={[styles.indicator, { backgroundColor: getCravingColor(entry.craving, theme) }]}>
  <Text style={styles.cravingText}>{entry.craving}</Text>
</View>
```

---

### 12. Sectioned Layout with Dividers

```tsx
import { Divider } from '@/design-system';

<View>
  <Section1 />
  <Divider style={{ marginVertical: 24 }} />
  <Section2 />
  <Divider style={{ marginVertical: 24 }} />
  <Section3 />
</View>
```

---

## Migration Checklist

When migrating a screen to the design system:

- [ ] Replace react-native-paper components with design system
- [ ] Remove all hardcoded colors (except #FFFFFF for white text)
- [ ] Add entrance animations (fade + slide)
- [ ] Add Toast for save success/error
- [ ] Add haptic feedback for important actions (mobile)
- [ ] Use TextArea instead of TextInput for multi-line
- [ ] Add character counters to text inputs
- [ ] Implement EmptyState for empty lists
- [ ] Add accessibility labels
- [ ] Use `useTheme()` for all colors
- [ ] Use Text component for semantic typography
- [ ] Add dividers between sections
- [ ] Test on light and dark modes

---

## Design System Component Count

**Total: 15 components**

1. Badge
2. Button
3. Card
4. Divider
5. EmptyState
6. FloatingActionButton
7. Input
8. ListItem
9. Modal
10. ProgressBar
11. SobrietyCounter
12. Text ← NEW
13. TextArea
14. Toast
15. Toggle

---

## Import Statement

```tsx
import {
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  FloatingActionButton,
  Input,
  ListItem,
  Modal,
  ProgressBar,
  SobrietyCounter,
  Text,
  TextArea,
  Toast,
  Toggle,
  useTheme,
} from '@/design-system';
```

---

## Performance Tips

1. **Always use native driver for animations**
   ```tsx
   useNativeDriver: true
   ```

2. **Memoize callbacks**
   ```tsx
   const handleSave = useCallback(async () => { ... }, [deps]);
   ```

3. **Limit character counts**
   ```tsx
   maxLength={5000}
   ```

4. **Use platform checks for mobile-only features**
   ```tsx
   if (Platform.OS !== 'web') { ... }
   ```

---

## Accessibility Tips

1. **Add labels to indicators**
   ```tsx
   accessibilityLabel="Craving level: 7 out of 10"
   accessibilityRole="text"
   ```

2. **Use semantic Text variants**
   ```tsx
   <Text variant="h2">Heading</Text>
   ```

3. **Ensure touch targets ≥48x48dp**

4. **Provide context in placeholders**
   ```tsx
   placeholder="Take your time to reflect and write your answer here..."
   ```

---

## Common Mistakes to Avoid

❌ **Don't use react-native-paper**
```tsx
import { Card } from 'react-native-paper'; // WRONG
```

✅ **Use design system**
```tsx
import { Card } from '@/design-system'; // CORRECT
```

---

❌ **Don't hardcode colors**
```tsx
backgroundColor: '#2196f3' // WRONG
```

✅ **Use theme colors**
```tsx
backgroundColor: theme.colors.primary // CORRECT
```

---

❌ **Don't use TextInput for multi-line**
```tsx
<TextInput multiline /> // WRONG
```

✅ **Use TextArea**
```tsx
<TextArea minHeight={200} maxLength={5000} showCharacterCount /> // CORRECT
```

---

❌ **Don't navigate immediately after save**
```tsx
await save();
navigation.goBack(); // WRONG - user doesn't see success
```

✅ **Show feedback, then navigate**
```tsx
await save();
setShowToast(true);
setTimeout(() => navigation.goBack(), 1000); // CORRECT
```

---

## Questions?

Refer to:
- **Full Summary:** `UI_UX_PHASE_3_SUMMARY.md`
- **Component Docs:** `apps/mobile/src/design-system/components/`
- **Phase 1 & 2:** `UI_UX_PHASE_2_SUMMARY.md`, `UI_UX_ENHANCEMENT_SUMMARY.md`

**Happy coding!** 🎨
