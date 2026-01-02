# UI/UX Enhancement Quick Reference
**For Developers**: Fast reference for the new patterns established

---

## ✅ DO's - New Patterns to Follow

### Always Use Design System
```typescript
// ✅ CORRECT
import { useTheme, Card, Button, Modal } from '../../../design-system';

const theme = useTheme();

<View style={{ backgroundColor: theme.colors.background }}>
  <Card variant="elevated">
    <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
      Title
    </Text>
  </Card>
</View>
```

```typescript
// ❌ WRONG - Don't use hardcoded colors
<View style={{ backgroundColor: '#f5f5f5' }}>
  <Card style={{ backgroundColor: '#ffffff' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }}>
      Title
    </Text>
  </Card>
</View>
```

---

### Use Modal Instead of Alert
```typescript
// ✅ CORRECT
const [showModal, setShowModal] = useState(false);

<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Delete"
  message="Are you sure you want to delete this item?"
  actions={[
    { title: 'Cancel', onPress: () => {}, variant: 'outline' },
    { title: 'Delete', onPress: handleDelete, variant: 'danger' },
  ]}
  dismissable
/>
```

```typescript
// ❌ WRONG - Don't use Alert (violates CLAUDE.md)
Alert.alert(
  'Confirm Delete',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', onPress: handleDelete, style: 'destructive' },
  ]
);
```

---

### Use Design Tokens for Spacing
```typescript
// ✅ CORRECT
<View style={{
  paddingHorizontal: theme.spacing.md,
  marginBottom: theme.spacing.lg,
  gap: theme.spacing.sm,
}}>
  {/* Content */}
</View>
```

```typescript
// ❌ WRONG - Don't use hardcoded pixel values
<View style={{
  paddingHorizontal: 16,
  marginBottom: 24,
  gap: 8,
}}>
  {/* Content */}
</View>
```

---

### Accessibility is Required
```typescript
// ✅ CORRECT
<Button
  title="Save"
  onPress={handleSave}
  variant="primary"
  accessibilityLabel="Save journal entry"
  accessibilityHint="Saves your entry and returns to the list"
  accessibilityState={{ disabled: isLoading }}
/>

<TouchableOpacity
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Step 1: Admit powerlessness"
  accessibilityHint="Tap to view step questions and add your answers"
>
  {/* Content */}
</TouchableOpacity>
```

```typescript
// ❌ WRONG - Missing accessibility props
<Button
  title="Save"
  onPress={handleSave}
/>

<TouchableOpacity onPress={handlePress}>
  {/* Content */}
</TouchableOpacity>
```

---

### Card Variants
```typescript
// ✅ Use the right variant for the use case

// Static content card
<Card variant="elevated">
  <Text>Read-only content</Text>
</Card>

// Interactive/tappable card
<Card variant="interactive" onPress={handlePress}>
  <Text>Tap me!</Text>
</Card>

// Default (no shadow)
<Card variant="default">
  <Text>Minimal card</Text>
</Card>
```

---

## 🎨 Common UI Patterns

### Empty State Pattern
```typescript
<Card variant="elevated">
  <View style={styles.emptyState}>
    <MaterialCommunityIcons
      name="account-search"
      size={48}
      color={theme.colors.muted}
      style={{ marginBottom: theme.spacing.sm }}
    />
    <Text style={[
      theme.typography.body,
      { color: theme.colors.textSecondary, textAlign: 'center' }
    ]}>
      No items found
    </Text>
    <Button
      title="Add First Item"
      onPress={handleAdd}
      variant="primary"
      size="medium"
      style={{ marginTop: theme.spacing.md }}
    />
  </View>
</Card>

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
```

---

### Success Toast Pattern
```typescript
const [successMessage, setSuccessMessage] = useState<string | null>(null);

// Show toast
setSuccessMessage('Action completed!');
setTimeout(() => setSuccessMessage(null), 3000);

// Render toast
{successMessage && (
  <View style={[
    styles.successToast,
    {
      backgroundColor: theme.colors.success,
      borderRadius: theme.radius.button,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    }
  ]}>
    <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
    <Text style={[
      theme.typography.label,
      { color: '#FFFFFF', marginLeft: theme.spacing.sm }
    ]}>
      {successMessage}
    </Text>
  </View>
)}

const styles = StyleSheet.create({
  successToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
```

---

### Info/Warning Card Pattern
```typescript
<View style={{
  backgroundColor: theme.colors.info + '15', // 15% opacity
  padding: theme.spacing.md,
  borderRadius: theme.radius.card,
  flexDirection: 'row',
}}>
  <MaterialCommunityIcons
    name="information"
    size={24}
    color={theme.colors.info}
    style={{ marginRight: theme.spacing.sm }}
  />
  <Text style={[
    theme.typography.bodySmall,
    { color: theme.colors.text, flex: 1, lineHeight: 20 }
  ]}>
    Your helpful information message here.
  </Text>
</View>
```

---

### Loading State Pattern
```typescript
if (loading) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[
          theme.typography.body,
          { color: theme.colors.textSecondary, marginTop: theme.spacing.md }
        ]}>
          Loading...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

### List Item Pattern (from ProfileScreen)
```typescript
interface ListItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  onPress?: () => void;
  disabled?: boolean;
  iconColor?: string;
}

function ListItem({
  icon,
  title,
  description,
  onPress,
  disabled = false,
  iconColor,
}: ListItemProps): React.ReactElement {
  const theme = useTheme();

  const content = (
    <View style={[styles.listItem, { opacity: disabled ? 0.6 : 1 }]}>
      <View style={[styles.listItemIcon, { marginRight: theme.spacing.md }]}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor || theme.colors.primary}
        />
      </View>
      <View style={styles.listItemContent}>
        <Text style={[theme.typography.label, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[
          theme.typography.bodySmall,
          { color: theme.colors.textSecondary, marginTop: 2 }
        ]}>
          {description}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={theme.colors.textSecondary}
      />
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityHint={description}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View>{content}</View>;
}
```

---

## 📐 Design Token Reference

### Colors
```typescript
theme.colors.primary        // iOS blue
theme.colors.secondary      // iOS green
theme.colors.danger         // Red
theme.colors.success        // Green
theme.colors.warning        // Orange
theme.colors.info           // Cyan

theme.colors.background     // Page background
theme.colors.surface        // Card background
theme.colors.text           // Primary text
theme.colors.textSecondary  // Secondary text
theme.colors.textTertiary   // Tertiary text

theme.colors.border         // Borders
theme.colors.divider        // Dividers
theme.colors.disabled       // Disabled state
theme.colors.muted          // Muted elements
```

### Spacing
```typescript
theme.spacing.xs    // 4
theme.spacing.sm    // 8
theme.spacing.md    // 16
theme.spacing.lg    // 24
theme.spacing.xl    // 32
```

### Typography
```typescript
theme.typography.displayLarge
theme.typography.displayMedium
theme.typography.h1
theme.typography.h2
theme.typography.h3
theme.typography.body
theme.typography.bodySmall
theme.typography.label
theme.typography.labelLarge
theme.typography.caption
```

### Border Radius
```typescript
theme.radius.button   // 10
theme.radius.card     // 12
theme.radius.modal    // 16
```

### Shadows
```typescript
theme.shadows.sm      // Small elevation
theme.shadows.md      // Medium elevation
theme.shadows.lg      // Large elevation
theme.shadows.xl      // Extra large elevation

// Dark mode variants
theme.shadows.smDark
theme.shadows.mdDark
theme.shadows.lgDark
theme.shadows.xlDark
```

---

## 🎯 Button Variants

```typescript
// Primary (filled blue)
<Button title="Save" variant="primary" onPress={handleSave} />

// Secondary (filled green)
<Button title="Accept" variant="secondary" onPress={handleAccept} />

// Danger (filled red)
<Button title="Delete" variant="danger" onPress={handleDelete} />

// Outline (border only)
<Button title="Cancel" variant="outline" onPress={handleCancel} />
```

---

## 🃏 Card Variants

```typescript
// Default (no shadow, minimal)
<Card variant="default">...</Card>

// Elevated (with shadow)
<Card variant="elevated">...</Card>

// Interactive (with press animation)
<Card variant="interactive" onPress={handlePress}>...</Card>
```

---

## 💬 Modal Variants

```typescript
// Center modal (alerts, confirmations)
<Modal variant="center" title="Confirm" message="Are you sure?" ... />

// Bottom sheet (actions, forms)
<Modal variant="bottom" title="Options" ... />
```

---

## 🎨 Color Opacity Pattern

For tinted backgrounds:
```typescript
// 15% opacity for subtle tints
backgroundColor: theme.colors.success + '15'

// 20% opacity for icon backgrounds
backgroundColor: theme.colors.primary + '20'

// Common opacities: '10', '15', '20', '30'
```

---

## ⚠️ Anti-Patterns to Avoid

### Never Use Alert
```typescript
// ❌ NEVER DO THIS
Alert.alert('Title', 'Message', [{ text: 'OK' }]);

// ✅ DO THIS INSTEAD
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Title"
  message="Message"
  actions={[{ title: 'OK', onPress: () => {} }]}
/>
```

### Never Hardcode Colors
```typescript
// ❌ NEVER DO THIS
<View style={{ backgroundColor: '#007AFF' }}>

// ✅ DO THIS INSTEAD
<View style={{ backgroundColor: theme.colors.primary }}>
```

### Never Hardcode Typography
```typescript
// ❌ NEVER DO THIS
<Text style={{ fontSize: 28, fontWeight: 'bold' }}>

// ✅ DO THIS INSTEAD
<Text style={theme.typography.h1}>
```

### Never Skip Accessibility
```typescript
// ❌ NEVER DO THIS
<TouchableOpacity onPress={handlePress}>
  <Text>Tap me</Text>
</TouchableOpacity>

// ✅ DO THIS INSTEAD
<TouchableOpacity
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Descriptive label"
  accessibilityHint="What happens when tapped"
>
  <Text>Tap me</Text>
</TouchableOpacity>
```

---

## 🔍 Testing Checklist

Before committing:
- [ ] Zero hardcoded colors (all from theme)
- [ ] Zero hardcoded spacing (all from theme.spacing)
- [ ] Zero hardcoded typography (all from theme.typography)
- [ ] All buttons have accessibilityLabel
- [ ] All touchable elements have accessibilityRole
- [ ] Touch targets ≥48x48dp for critical actions
- [ ] No Alert usage (use Modal instead)
- [ ] No react-native-paper imports (use design-system)
- [ ] Tested in light mode
- [ ] Tested in dark mode

---

## 📚 File Locations

### Design System
- Components: `apps/mobile/src/design-system/components/`
- Tokens: `apps/mobile/src/design-system/tokens/`
- Hooks: `apps/mobile/src/design-system/hooks/`

### Example Implementations
- Emergency Screen: `apps/mobile/src/features/emergency/screens/EmergencyScreen.tsx`
- Sponsor Screen: `apps/mobile/src/features/sponsor/screens/SponsorScreen.tsx`
- Steps Screen: `apps/mobile/src/features/steps/screens/StepsOverviewScreen.tsx`
- Profile Screen: `apps/mobile/src/features/profile/screens/ProfileScreen.tsx`

---

**Quick Tip**: When in doubt, look at the 4 redesigned screens above as reference implementations!
