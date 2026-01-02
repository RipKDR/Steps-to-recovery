# Design System Component Quick Reference

**Last Updated**: 2026-01-02 (Phase 2)
**Components**: 14 total

---

## Component Catalog

### Form Components

#### Input
```typescript
import { Input } from '../design-system/components';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
  error={emailError}
  hint="We'll never share your email"
  required
  leftIcon={<Icon name="mail" />}
/>
```

**Props**: `label`, `value`, `onChangeText`, `error`, `hint`, `required`, `leftIcon`, `rightIcon`, `secureTextEntry`

---

#### TextArea ✨ NEW
```typescript
import { TextArea } from '../design-system/components';

<TextArea
  label="Reflection"
  value={reflection}
  onChangeText={setReflection}
  placeholder="Write your thoughts..."
  minHeight={140}
  maxLength={500}
  showCharacterCount
/>
```

**Props**: `label`, `value`, `onChangeText`, `error`, `hint`, `required`, `minHeight`, `maxLength`, `showCharacterCount`

**Use Cases**: Journal entries, reflections, intentions, step work responses

---

#### Button
```typescript
import { Button } from '../design-system/components';

<Button
  variant="primary"  // primary | secondary | tertiary | danger
  size="large"       // small | medium | large
  onPress={handleSubmit}
  disabled={loading}
  loading={loading}
>
  Submit
</Button>
```

**Variants**: `primary` (blue), `secondary` (gray), `tertiary` (text only), `danger` (red)
**Sizes**: `small` (32px), `medium` (40px), `large` (48px)

---

#### Toggle
```typescript
import { Toggle } from '../design-system/components';

<Toggle
  value={enabled}
  onValueChange={setEnabled}
  label="Enable Notifications"
  hint="Receive daily reminders"
/>
```

---

### Feedback Components

#### Toast ✨ NEW
```typescript
import { Toast } from '../design-system/components';

const [showToast, setShowToast] = useState(false);

<Toast
  visible={showToast}
  message="Check-in saved successfully!"
  variant="success"  // success | error | info | warning
  duration={3000}
  onDismiss={() => setShowToast(false)}
/>
```

**Variants**:
- `success`: Green with checkmark
- `error`: Red with error icon
- `info`: Blue with info icon
- `warning`: Orange with warning icon

**Position**: Top of screen (below status bar)

---

#### Modal
```typescript
import { Modal } from '../design-system/components';
import type { ModalAction } from '../design-system/components';

const actions: ModalAction[] = [
  { label: 'Delete', onPress: handleDelete, style: 'destructive' },
  { label: 'Cancel', onPress: () => setVisible(false), style: 'cancel' },
];

<Modal
  visible={showModal}
  title="Confirm Delete"
  message="Are you sure you want to delete this entry?"
  actions={actions}
  variant="center"  // center | bottom
  onClose={() => setVisible(false)}
/>
```

**Variants**: `center` (alert-style), `bottom` (action sheet)
**Action Styles**: `default`, `primary`, `destructive`, `cancel`

---

#### EmptyState ✨ NEW
```typescript
import { EmptyState } from '../design-system/components';

<EmptyState
  icon="inbox"
  title="No Entries Yet"
  description="Start your recovery journey by creating your first journal entry."
  actionLabel="Create Entry"
  onAction={handleCreate}
  actionVariant="primary"
/>
```

**Use Cases**: Empty lists, no search results, missing content

---

### Layout Components

#### Card
```typescript
import { Card } from '../design-system/components';

<Card
  variant="elevated"  // flat | elevated
  onPress={handlePress}
  style={{ marginBottom: 16 }}
>
  <Text>Card content</Text>
</Card>
```

**Variants**:
- `flat`: No shadow, subtle border
- `elevated`: Shadow with rounded corners

**Interactive**: Set `onPress` to make pressable

---

#### ListItem ✨ NEW
```typescript
import { ListItem } from '../design-system/components';

<ListItem
  icon="person"
  iconColor={theme.colors.primary}
  label="Sponsor"
  value="john@example.com"
  showChevron
  onPress={handlePress}
/>

// Or with custom elements
<ListItem
  leftElement={<Avatar />}
  rightElement={<Badge />}
  label="John Doe"
  value="2 shared entries"
/>
```

**Use Cases**: Settings, profile, contact lists, navigation

---

#### Divider ✨ NEW
```typescript
import { Divider } from '../design-system/components';

<Divider marginVertical={16} />
<Divider color={theme.colors.primary} />
```

**Simple and Clean**: Hairline horizontal separator

---

### Progress & Status Components

#### ProgressBar
```typescript
import { ProgressBar } from '../design-system/components';

<ProgressBar
  progress={0.6}  // 0.0 to 1.0
  showLabel
  label="60% Complete"
  color={theme.colors.success}
/>
```

---

#### Badge
```typescript
import { Badge } from '../design-system/components';

<Badge
  variant="success"  // neutral | primary | success | warning | danger
  size="medium"      // small | medium | large
  label="New"
  icon="check"
/>
```

---

#### SobrietyCounter
```typescript
import { SobrietyCounter } from '../design-system/components';

<SobrietyCounter
  sobrietyDate={new Date('2024-01-01')}
  showMilestones
  onMilestonePress={handleMilestone}
/>
```

**Special**: Clean time tracker with milestone badges

---

#### FloatingActionButton
```typescript
import { FloatingActionButton } from '../design-system/components';

<FloatingActionButton
  icon="add"
  onPress={handleCreate}
  accessibilityLabel="Create new entry"
/>
```

**Position**: Fixed bottom-right corner

---

## Common Patterns

### Form with Validation
```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validate = () => {
  if (!email.includes('@')) {
    setEmailError('Invalid email');
    return false;
  }
  setEmailError('');
  return true;
};

<Input
  label="Email"
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    setEmailError(''); // Clear error on change
  }}
  error={emailError}
/>
```

---

### Success Toast + Haptic
```typescript
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const handleSuccess = async () => {
  // Haptic feedback
  if (Platform.OS !== 'web') {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  }

  // Show toast
  setToastMessage('Success!');
  setToastVariant('success');
  setShowToast(true);

  // Navigate after delay
  setTimeout(() => {
    navigation.goBack();
  }, 1500);
};
```

---

### Modal Confirmation
```typescript
const [showModal, setShowModal] = useState(false);

const handleDelete = () => {
  setShowModal(true);
};

const confirmDelete = async () => {
  setShowModal(false);
  await deleteItem();
  // Show success toast
};

const actions: ModalAction[] = [
  {
    label: 'Delete',
    onPress: confirmDelete,
    style: 'destructive'
  },
  {
    label: 'Cancel',
    onPress: () => setShowModal(false),
    style: 'cancel'
  },
];

<Modal
  visible={showModal}
  title="Delete Entry?"
  message="This action cannot be undone."
  actions={actions}
/>
```

---

### Empty List with Action
```typescript
const renderEmpty = () => (
  <EmptyState
    icon="inbox"
    title="No Entries"
    description="Get started by creating your first entry."
    actionLabel="Create Entry"
    onAction={() => navigation.navigate('NewEntry')}
  />
);

<FlatList
  data={items}
  renderItem={renderItem}
  ListEmptyComponent={renderEmpty}
/>
```

---

### Entrance Animation
```typescript
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
      tension: 40,
      useNativeDriver: true,
    }),
  ]).start();
}, []);

<Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
  {/* Content */}
</Animated.View>
```

---

### Settings List
```typescript
<Card variant="flat">
  <ListItem
    icon="person"
    label="Account"
    showChevron
    onPress={() => navigate('Account')}
  />
  <Divider />
  <ListItem
    icon="notifications"
    label="Notifications"
    rightElement={
      <Toggle value={enabled} onValueChange={setEnabled} />
    }
  />
  <Divider />
  <ListItem
    icon="security"
    label="Privacy"
    showChevron
    onPress={() => navigate('Privacy')}
  />
</Card>
```

---

## Theme Usage

### Accessing Theme
```typescript
import { useTheme } from '../design-system/hooks/useTheme';

const theme = useTheme();

<Text style={{ color: theme.colors.text }}>
  Hello
</Text>
```

### Common Theme Colors
```typescript
theme.colors.primary         // Blue
theme.colors.primaryLight    // Light blue
theme.colors.success         // Green
theme.colors.successLight    // Light green
theme.colors.danger          // Red
theme.colors.dangerLight     // Light red
theme.colors.text            // Dark gray (main text)
theme.colors.textSecondary   // Medium gray (secondary text)
theme.colors.background      // Off-white
theme.colors.surface         // White
theme.colors.surfaceVariant  // Light gray
theme.colors.border          // Light gray
```

### Typography Styles
```typescript
theme.typography.largeTitle  // 34px bold
theme.typography.title1      // 28px bold
theme.typography.title2      // 22px bold
theme.typography.title3      // 20px semibold
theme.typography.body        // 16px regular
theme.typography.label       // 14px semibold
theme.typography.caption     // 12px regular
```

### Spacing Scale
```typescript
theme.spacing.xs   // 4
theme.spacing.sm   // 8
theme.spacing.md   // 16
theme.spacing.lg   // 24
theme.spacing.xl   // 32
theme.spacing.xxl  // 48
```

---

## Accessibility Best Practices

### Labels & Hints
```typescript
<Button
  onPress={handleSubmit}
  accessibilityLabel="Submit form"
  accessibilityHint="Saves your changes and returns to the previous screen"
  accessibilityRole="button"
/>
```

### State Communication
```typescript
<Button
  disabled={loading}
  accessibilityState={{
    disabled: loading,
    busy: loading
  }}
/>
```

### Screen Reader Announcements
```typescript
<Toast
  visible={showToast}
  message="Entry saved"
  // Automatically uses accessibilityRole="alert"
/>
```

### Touch Targets
All interactive components have minimum 48x48dp touch targets (WCAG AAA)

---

## Component Decision Tree

**Need user input?**
- Single line → `Input`
- Multi-line → `TextArea`
- Toggle → `Toggle`

**Need to show feedback?**
- Quick success/error → `Toast`
- Requires confirmation → `Modal`
- Empty state → `EmptyState`

**Need layout?**
- Container → `Card`
- List item → `ListItem`
- Separator → `Divider`

**Need action?**
- Primary action → `Button` (primary)
- Secondary action → `Button` (secondary)
- Floating action → `FloatingActionButton`

**Need progress?**
- Linear progress → `ProgressBar`
- Status badge → `Badge`
- Clean time → `SobrietyCounter`

---

## Import Cheat Sheet

```typescript
// Single component
import { Button } from '../design-system/components';

// Multiple components
import {
  Button,
  Card,
  Input,
  Toast
} from '../design-system/components';

// With types
import { Button, type ButtonProps } from '../design-system/components';

// Theme
import { useTheme } from '../design-system/hooks/useTheme';
```

---

## Deprecated / Don't Use

❌ **react-native-paper**: Use design system components instead
❌ **Alert.alert()**: Use `Modal` or `Toast` instead
❌ **Hardcoded colors**: Use `theme.colors.*` instead
❌ **Inline styles for colors**: Use theme
❌ **console.log**: Use `logger` from `utils/logger.ts`

---

**Quick Reference Version**: 2.0 (Phase 2)
**Components**: 14 total (5 new in Phase 2)
**Last Updated**: 2026-01-02
